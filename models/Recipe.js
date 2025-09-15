
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  type: {
    type: String,
    required: [true, 'Recipe type is required'],
    enum: {
      values: ['veg', 'non-veg'],
      message: 'Recipe type must be either "veg" or "non-veg"'
    }
  },
  
  ingredients: {
    type: String,
    required: [true, 'Ingredients are required'],
    trim: true,
    minlength: [10, 'Ingredients must be at least 10 characters long'],
    maxlength: [2000, 'Ingredients cannot exceed 2000 characters']
  },
  
  instructions: {
    type: String,
    required: [true, 'Instructions are required'],
    trim: true,
    minlength: [20, 'Instructions must be at least 20 characters long'],
    maxlength: [5000, 'Instructions cannot exceed 5000 characters']
  },
  
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipe author is required']
  },
  
  authorName: {
    type: String,
    required: [true, 'Author name is required']
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true 
});


recipeSchema.index({ author: 1 });
recipeSchema.index({ type: 1 });
recipeSchema.index({ createdAt: -1 });
recipeSchema.index({ title: 'text', ingredients: 'text' });


recipeSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});


recipeSchema.statics.findByAuthor = async function(authorId) {
  return await this.find({ author: authorId })
    .populate('author', 'username name')
    .sort({ createdAt: -1 });
};

recipeSchema.statics.searchRecipes = async function(query, filter = {}) {
  const searchCriteria = { ...filter };
  
  if (query) {
    searchCriteria.$or = [
      { title: { $regex: query, $options: 'i' } },
      { ingredients: { $regex: query, $options: 'i' } },
      { authorName: { $regex: query, $options: 'i' } }
    ];
  }
  
  return await this.find(searchCriteria)
    .populate('author', 'username name')
    .sort({ createdAt: -1 });
};

recipeSchema.virtual('ingredientsArray').get(function() {
  return this.ingredients.split('\n').filter(ingredient => ingredient.trim());
});


recipeSchema.virtual('instructionsArray').get(function() {
  return this.instructions.split('\n').filter(instruction => instruction.trim());
});

recipeSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Recipe', recipeSchema);