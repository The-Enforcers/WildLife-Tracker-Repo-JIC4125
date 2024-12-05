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
    const { page = 1, search = '', limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Construct a case-insensitive regex search for the title and author's displayName
    const searchRegex = new RegExp(search, 'i');

    // Find posts that match the search criteria
    const posts = await Post.find({
      reportCount: { $gt: 0 },
      $or: [
        { title: { $regex: searchRegex } }, // Search by title
        { authorId: { $in: await User.find({ displayName: { $regex: searchRegex } }).select('_id') } } // Search by author's displayName
      ]
    })
      .sort({ reportCount: -1 })
      .skip(skip)
      .limit(limit)
      .populate('authorId', 'displayName email isBanned'); // Populate the author details

    // console.log(posts);

    // Get the total number of posts matching the search
    const total = await Post.countDocuments({
      reportCount: { $gt: 0 },
      $or: [
        { title: { $regex: searchRegex } },
        { authorId: { $in: await User.find({ displayName: { $regex: searchRegex } }).select('_id') } }
      ]
    });

    res.status(200).json({
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        totalResults: total,
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


router.get('/users', async (req, res) => {
  try {
    const { page = 1, search = '', role = '' } = req.query; // Get query parameters
    const limit = 10; // Number of users per page
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    // Create a filter object based on search and role
    const filter = {};
    if (search) {
      filter.displayName = { $regex: search, $options: 'i' }; // Case-insensitive search
    }
    if (role) {
      filter.role = role; // Exact match for role
    }

    // Fetch the filtered and paginated users
    const users = await User.find(filter)
      .select('displayName email role') // Select only necessary fields
      .skip(skip)
      .limit(limit);

    // Get the total count of users matching the filter
    const totalUsers = await User.countDocuments(filter);

    // Calculate total pages
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      users,
      pagination: {
        totalPages,
        currentPage: parseInt(page, 10),
        totalResults: totalUsers
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users' });
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