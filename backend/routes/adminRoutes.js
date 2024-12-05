const express = require('express');
const router = express.Router();
const { generalLimit, createPostLimit, imageDownloadLimit, imageUploadLimit } = require('../middleware/rateLimits');
const verifyToken = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const Post = require('../models/Post');
const User = require('../models/User');

// Apply both verifyToken and adminMiddleware to all routes
router.use(verifyToken, adminMiddleware);

// Get reported posts
router.get('/reported-posts', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ reportCount: { $gt: 0 } })
      .sort({ reportCount: -1 })
      .skip(skip)
      .limit(limit)
      .populate('authorId', 'displayName email isBanned');

    const total = await Post.countDocuments({ reportCount: { $gt: 0 } });

    res.status(200).json({
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        postsPerPage: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Error in getReportedPosts:', err);
    res.status(500).json({ message: err.message });
  }
});

// Ban user
router.post('/users/:userId/ban', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot ban admin users' });
    }

    user.isBanned = true;
    user.role = 'banned';
    await user.save();

    res.status(200).json({ message: 'User banned successfully' });
  } catch (err) {
    console.error('Error banning user:', err);
    res.status(500).json({ message: err.message });
  }
});

// Unban user
router.post('/users/:userId/unban', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBanned = false;
    user.role = 'user'; // Default role after unbanning; modify as needed.
    await user.save();

    res.status(200).json({ message: 'User unbanned successfully' });
  } catch (err) {
    console.error('Error unbanning user:', err);
    res.status(500).json({ message: err.message });
  }
});


// Backend route to add to adminRoutes.js
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'displayName email role');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/users/:userId/role', async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin', 'banned'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = role;

    // Update isBanned based on the role
    if (role === 'banned') {
      user.isBanned = true;
    } else {
      user.isBanned = false;
    }

    await user.save();

    res.status(200).json({ message: 'User role and status updated successfully' });
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;