// controllers/postController.js
const Post = require("../models/Post");
const User = require("../models/User");
const { getGfs, getGridFSBucket } = require("../utils/gridFs");
const mongoose = require('mongoose');


// updated for pagination
exports.getAllPosts = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    
    const posts = await Post.find()
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments();

    res.status(200).json({
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        postsPerPage: limit,
        hasNextPage: skip + limit < total,
        hasPreviousPage: page > 1
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPostsByAuthorId = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req.query);
    //
    const posts = await Post.find({ authorId: req.params.authorId })
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

    const total = await Post.countDocuments({ authorId: req.params.authorId });

    res.status(200).json({
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        postsPerPage: limit,
        hasNextPage: skip + limit < total,
        hasPreviousPage: page > 1
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPost = async (req, res) => {
  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB in bytes

  // Calculate size of req.body
  const requestSize = JSON.stringify(req.body).length;

  if (requestSize > MAX_SIZE) {
    return res.status(400).json({ message: "Post size exceeds 10 MB limit." });
  }

  const {
    postImage,
    title,
    scientificName,
    commonName,
    animalType,
    trackerType,
    trackerImage,
    dataTypes,
    enclosureType,
    enclosureImage,
    attachmentType,
    attachmentImage,
    recommendations,
    author,
    authorImage,
  } = req.body;

  const newPost = new Post({
    postImage,
    title,
    scientificName,
    commonName,
    animalType,
    trackerType,
    trackerImage,
    dataTypes,
    enclosureType,
    enclosureImage,
    attachmentType,
    attachmentImage,
    recommendations,
    author,
    authorId: req.userId, // Set authorId from req.userId
    authorImage,
    date: new Date(),
    lastUpdated: null,
  });

  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//added for pagination
const getPaginationParams = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.max(1, Math.min(parseInt(query.limit) || 12, 50)); // Default 12, max 50
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};



function build_search_terms(query) {
  const {
    title,
    scientificName,
    commonName,
    animalType,
    trackerType,
    dataTypes,
    enclosureType,
    attachmentType,
    recommendations,
    sort
  } = query;

  const search_requirements = {};

  if (title) {
    search_requirements.$or = [
      { title: new RegExp(title, "i") },
      { scientificName: new RegExp(title, "i") },
      { commonName: new RegExp(title, "i") },
      { author: new RegExp(title, "i") },
    ];
  }

  if (animalType) {
    search_requirements.animalType = { $in: animalType.split(",") };
  }

  if (trackerType) {
    search_requirements.trackerType = { $in: trackerType.split(",") };
  }

  if (dataTypes) {
    search_requirements.dataTypes = { $in: dataTypes.split(",") };
  }

  if (enclosureType) {
    search_requirements.enclosureType = { $in: enclosureType.split(",") };
  }

  if (attachmentType) {
    search_requirements.attachmentType = { $in: attachmentType.split(",") };
  }

  if (recommendations) {
    search_requirements.recommendations = new RegExp(recommendations, "i");
  }

  return search_requirements;
}

function buildSortObject(sortQuery) {
  if (!sortQuery) return { date: -1 }; // Default sort by date desc

  switch (sortQuery) {
    case 'oldToNew':
      return { date: 1 };
    case 'mostLiked':
      return { likeCount: -1, date: -1 };
    case 'newToOld':
    default:
      return { date: -1 };
  }
}

exports.searchPosts = async (req, res) => {
  try {
    // Get pagination parameters
    const { page, limit, skip } = getPaginationParams(req.query);
    
    // Build search query
    const searchQuery = build_search_terms(req.query);
    
    // Build sort object
    const sortObject = buildSortObject(req.query.sort);

    // Execute main query with pagination
    const posts = await Post.find(searchQuery)
      .sort(sortObject)
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance

    // Get total count for pagination
    const total = await Post.countDocuments(searchQuery);

    // Send paginated response
    res.status(200).json({
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        postsPerPage: limit,
        hasNextPage: skip + limit < total,
        hasPreviousPage: page > 1
      }
    });
  } catch (err) {
    console.error('Search posts error:', err);
    res.status(500).json({ 
      message: "Error searching posts",
      error: err.message 
    });
  }
};



exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Fetch the existing post
    const existingPost = await Post.findById(id);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Authorization check
    if (existingPost.authorId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Preserve existing image fields only if they are undefined in the update
    ["postImage", "trackerImage", "enclosureImage", "attachmentImage"].forEach(
      (field) => {
        if (updateData[field] === undefined) {
          updateData[field] = existingPost[field];
        }
      }
    );

    updateData.lastUpdated = new Date();

    const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.hasUserLikedPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const hasLiked = post.likes
      .map((id) => id.toString())
      .includes(userId.toString());

    res.json({ hasLiked });
  } catch (err) {
    console.error("Error in hasUserLikedPost:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const alreadyLiked = post.likes
      .map((id) => id.toString())
      .includes(userId.toString());

    if (alreadyLiked) {
      return res.status(400).json({ message: "Post already liked by user" });
    }

    // Add like to post
    post.likes.push(userId);
    post.likeCount = post.likes.length;
    await post.save();

    res.json({ message: "Post liked successfully", likeCount: post.likeCount });
  } catch (err) {
    console.error("Error in likePost:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Remove like from post
    post.likes = post.likes.filter(
      (id) => id.toString() !== userId.toString()
    );
    post.likeCount = post.likes.length;
    await post.save();

    res.json({
      message: "Post unliked successfully",
      likeCount: post.likeCount,
    });
  } catch (err) {
    console.error("Error in unlikePost:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.getUserPostsLikes = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ authorId: userId });
    const totalLikes = posts.reduce((sum, post) => sum + post.likeCount, 0);

    res.json({
      totalLikes,
      postsCount: posts.length,
      averageLikes: posts.length > 0 ? totalLikes / posts.length : 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Starting delete process for post ID: ${id}`);

    if (!mongoose.connection.readyState) {
      console.error('MongoDB not connected');
      return res.status(500).json({ message: "Database connection error" });
    }

    const post = await Post.findById(id).exec();
    console.log('Found post:', post);

    if (!post) {
      console.log('Post not found in database');
      return res.status(404).json({ message: "Post not found" });
    }

    // Get user to check if they're an admin
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Allow deletion if user is admin OR is the post author
    if (user.role !== 'admin' && post.authorId.toString() !== req.userId.toString()) {
      console.log(`Authorization mismatch. Post author: ${post.authorId}, Request user: ${req.userId}`);
      return res.status(403).json({ message: "Unauthorized" });
    }

    const deletedPost = await Post.findByIdAndDelete(id);
    console.log('Post deleted from database:', deletedPost);

    const gfs = getGfs();
    const gridFSBucket = getGridFSBucket();

    if (!gfs || !gridFSBucket) {
      console.error('GridFS not initialized');
      return res.status(500).json({ message: "GridFS initialization error" });
    }

    // Handle image deletion
    const imageFields = ["postImage", "trackerImage", "enclosureImage", "attachmentImage"];
    const imageFilenames = imageFields.filter(field => post[field]).map(field => post[field]);

    console.log('Image filenames to delete:', imageFilenames);

    for (const filename of imageFilenames) {
      try {
        const file = await gfs.files.findOne({ filename });
        if (file) {
          await gridFSBucket.delete(file._id);
          console.log(`Deleted file: ${filename}`);
        }
      } catch (err) {
        console.error(`Error deleting file ${filename}:`, err);
      }
    }

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Delete post error:", err.stack);
    res.status(500).json({ message: err.message || "Server error during deletion" });
  }
};

exports.reportPost = async (req, res) => {
  try {
      const { postId } = req.params;
      const userId = req.userId;

      const post = await Post.findById(postId);

      if (!post) {
          return res.status(404).json({ message: "Post not found" });
      }

      const alreadyReported = post.reports
          .map((id) => id.toString())
          .includes(userId.toString());

      if (alreadyReported) {
          return res.status(400).json({ message: "Post already reported by user" });
      }

      // Add report to post
      post.reports.push(userId);
      post.reportCount = post.reports.length;
      await post.save();

      res.json({ message: "Post reported successfully", reportCount: post.reportCount });
  } catch (err) {
      console.error("Error in reportPost:", err);
      res.status(500).json({ message: err.message });
  }
};

exports.unreportPost = async (req, res) => {
  try {
      const { postId } = req.params;
      const userId = req.userId;

      const post = await Post.findById(postId);

      if (!post) {
          return res.status(404).json({ message: "Post not found" });
      }

      // Remove report from post
      post.reports = post.reports.filter(
          (id) => id.toString() !== userId.toString()
      );
      post.reportCount = post.reports.length;
      await post.save();

      res.json({
          message: "Post unreported successfully",
          reportCount: post.reportCount,
      });
  } catch (err) {
      console.error("Error in unreportPost:", err);
      res.status(500).json({ message: err.message });
  }
};

exports.hasUserReportedPost = async (req, res) => {
  try {
      const { postId } = req.params;
      const userId = req.userId;
      const post = await Post.findById(postId);

      if (!post) {
          console.log('Post not found');
          return res.status(404).json({ message: "Post not found" });
      }

      const hasReported = post.reports
          .map((id) => id.toString())
          .includes(userId.toString());

      res.json({ hasReported });
  } catch (err) {
      console.error("Error in hasUserReportedPost:", err);
      res.status(500).json({ message: err.message });
  }
};




