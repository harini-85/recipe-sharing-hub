

const express = require('express');
const Recipe = require('../models/Recipe');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { sanitizeInput, isValidRecipeType } = require('../utils/validation');

const router = express.Router();

/**
 * @route   GET /api/recipes
 * @desc    Get all recipes with optional filtering and search
 * @access  Public
 * @query   search - Search term for title, ingredients, or author
 * @query   type - Filter by recipe type (veg, non-veg)
 * @query   author - Filter by author username
 * @query   limit - Limit number of results (default: 50)
 * @query   page - Page number for pagination (default: 1)
 */
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { search, type, author, limit = 50, page = 1 } = req.query;
    
    
    const filter = {};
    
    if (type && ['veg', 'non-veg'].includes(type)) {
      filter.type = type;
    }
    
    if (author) {
      filter.authorName = new RegExp(author, 'i');
    }

  
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let recipes;
    
    if (search) {
      
      recipes = await Recipe.searchRecipes(search, filter);
    } else {
    
      recipes = await Recipe.find(filter)
        .populate('author', 'username name')
        .sort({ createdAt: -1 });
    }

  
    const paginatedRecipes = recipes.slice(skip, skip + parseInt(limit));
   
    const formattedRecipes = paginatedRecipes.map(recipe => ({
      id: recipe._id,
      title: recipe.title,
      type: recipe.type,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      author: recipe.authorName,
      authorId: recipe.author._id || recipe.author,
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt
    }));

    res.json({
      success: true,
      count: formattedRecipes.length,
      totalCount: recipes.length,
      page: parseInt(page),
      totalPages: Math.ceil(recipes.length / parseInt(limit)),
      recipes: formattedRecipes
    });

  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recipes'
    });
  }
});

/**
 * @route   GET /api/recipes/:id
 * @desc    Get single recipe by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'username name');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    res.json({
      success: true,
      recipe: {
        id: recipe._id,
        title: recipe.title,
        type: recipe.type,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        author: recipe.authorName,
        authorId: recipe.author._id,
        createdAt: recipe.createdAt,
        updatedAt: recipe.updatedAt,
        ingredientsArray: recipe.ingredientsArray,
        instructionsArray: recipe.instructionsArray
      }
    });

  } catch (error) {
    console.error('Get recipe error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid recipe ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching recipe'
    });
  }
});

/**
 * @route   POST /api/recipes
 * @desc    Create new recipe
 * @access  Private
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
   
    const titleRaw = req.body.title;
    const typeRaw = req.body.type;
    const ingredientsRaw = req.body.ingredients;
    const instructionsRaw = req.body.instructions;

    const title = sanitizeInput(titleRaw || '');
    const type = sanitizeInput(typeRaw || '');
    const ingredients = sanitizeInput(ingredientsRaw || '');
    const instructions = sanitizeInput(instructionsRaw || '');

 
    const errors = {};
    if (!title) errors.title = 'Recipe title is required';
    else if (title.length < 3) errors.title = 'Title must be at least 3 characters long';
    else if (title.length > 100) errors.title = 'Title cannot exceed 100 characters';

    if (!type) errors.type = 'Recipe type is required';
    else if (!isValidRecipeType(type)) errors.type = 'Recipe type must be either "veg" or "non-veg"';

    if (!ingredients) errors.ingredients = 'Ingredients are required';
    else if (ingredients.length < 10) errors.ingredients = 'Ingredients must be at least 10 characters long';
    else if (ingredients.length > 2000) errors.ingredients = 'Ingredients cannot exceed 2000 characters';

    if (!instructions) errors.instructions = 'Instructions are required';
    else if (instructions.length < 20) errors.instructions = 'Instructions must be at least 20 characters long';
    else if (instructions.length > 5000) errors.instructions = 'Instructions cannot exceed 5000 characters';

    if (Object.keys(errors).length) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

 
    const recipe = new Recipe({
      title,
      type,
      ingredients,
      instructions,
      author: req.user._id,
      authorName: req.user.username
    });

    await recipe.save();

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      recipe: {
        id: recipe._id,
        title: recipe.title,
        type: recipe.type,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        author: recipe.authorName,
        authorId: recipe.author,
        createdAt: recipe.createdAt
      }
    });

  } catch (error) {
    console.error('Create recipe error:', error);
    
    if (error.name === 'ValidationError') {
      const fieldErrors = {};
      Object.keys(error.errors).forEach((key) => {
        fieldErrors[key] = error.errors[key].message;
      });
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: fieldErrors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating recipe'
    });
  }
});

/**
 * @route   PUT /api/recipes/:id
 * @desc    Update recipe
 * @access  Private (only recipe author)
 */
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, type, ingredients, instructions } = req.body;
    const recipeId = req.params.id;

  
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

 
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own recipes'
      });
    }

  
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { title, type, ingredients, instructions },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Recipe updated successfully',
      recipe: {
        id: updatedRecipe._id,
        title: updatedRecipe.title,
        type: updatedRecipe.type,
        ingredients: updatedRecipe.ingredients,
        instructions: updatedRecipe.instructions,
        author: updatedRecipe.authorName,
        authorId: updatedRecipe.author,
        updatedAt: updatedRecipe.updatedAt
      }
    });

  } catch (error) {
    console.error('Update recipe error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid recipe ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating recipe'
    });
  }
});

/**
 * @route   DELETE /api/recipes/:id
 * @desc    Delete recipe
 * @access  Private (only recipe author)
 */
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const recipeId = req.params.id;

   
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

  
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own recipes'
      });
    }

   
    await Recipe.findByIdAndDelete(recipeId);

    res.json({
      success: true,
      message: 'Recipe deleted successfully'
    });

  } catch (error) {
    console.error('Delete recipe error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid recipe ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error deleting recipe'
    });
  }
});

/**
 * @route   GET /api/recipes/user/:userId
 * @desc    Get recipes by specific user
 * @access  Public
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const recipes = await Recipe.findByAuthor(req.params.userId);

    const formattedRecipes = recipes.map(recipe => ({
      id: recipe._id,
      title: recipe.title,
      type: recipe.type,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      author: recipe.authorName,
      authorId: recipe.author._id || recipe.author,
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt
    }));

    res.json({
      success: true,
      count: formattedRecipes.length,
      recipes: formattedRecipes
    });

  } catch (error) {
    console.error('Get user recipes error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error fetching user recipes'
    });
  }
});

/**
 * @route   GET /api/recipes/my/recipes
 * @desc    Get current user's recipes
 * @access  Private
 */
router.get('/my/recipes', authenticateToken, async (req, res) => {
  try {
    const recipes = await Recipe.findByAuthor(req.user._id);

    const formattedRecipes = recipes.map(recipe => ({
      id: recipe._id,
      title: recipe.title,
      type: recipe.type,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      author: recipe.authorName,
      authorId: recipe.author._id || recipe.author,
      createdAt: recipe.createdAt,
      updatedAt: recipe.updatedAt
    }));

    res.json({
      success: true,
      count: formattedRecipes.length,
      recipes: formattedRecipes
    });

  } catch (error) {
    console.error('Get my recipes error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your recipes'
    });
  }
});

module.exports = router;