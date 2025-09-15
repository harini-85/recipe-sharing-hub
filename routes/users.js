/**
 * User Management Routes
 * Handles user-related operations beyond authentication
 */

const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/users/profile/:username
 * @desc    Get public user profile by username
 * @access  Public
 */
router.get('/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

   
    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile'
    });
  }
});

/**
 * @route   GET /api/users/search
 * @desc    Search users by username or name
 * @access  Public
 * @query   q - Search query
 * @query   limit - Limit results (default: 10, max: 50)
 */
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const searchLimit = Math.min(parseInt(limit), 50);

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } }
      ]
    })
    .select('username name createdAt')
    .limit(searchLimit)
    .sort({ username: 1 });

    res.json({
      success: true,
      count: users.length,
      users: users.map(user => ({
        id: user._id,
        username: user.username,
        name: user.name,
        createdAt: user.createdAt
      }))
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching users'
    });
  }
});

/**
 * @route   GET /api/users/stats
 * @desc    Get platform statistics
 * @access  Public
 */
router.get('/stats', async (req, res) => {
  try {
    const Recipe = require('../models/Recipe');

    const [totalUsers, totalRecipes, vegRecipes, nonVegRecipes] = await Promise.all([
      User.countDocuments(),
      Recipe.countDocuments(),
      Recipe.countDocuments({ type: 'veg' }),
      Recipe.countDocuments({ type: 'non-veg' })
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalRecipes,
        vegRecipes,
        nonVegRecipes,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching platform statistics'
    });
  }
});

module.exports = router;