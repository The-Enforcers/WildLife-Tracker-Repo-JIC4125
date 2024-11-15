// controllers/postController.js
const Post = require("../models/Post");
const User = require("../models/User");
const { getGfs, getGridFSBucket } = require("../utils/gridFs");
const mongoose = require('mongoose');

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPostsByAuthorId = async (req, res) => {
  try {
    const posts = await Post.find({ authorId: req.params.authorId });
    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this author" });
    }
    res.json(posts);
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

function build_search_terms(req) {
  console.log(req.query);

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
  } = req.query;

  var search_requirements = {};

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
    search_requirements.enclosureType = new RegExp(enclosureType, "i");
  }

  if (attachmentType) {
    search_requirements.attachmentType = { $in: attachmentType.split(",") };
  }

  if (recommendations) {
    search_requirements.recommendations = new RegExp(recommendations, "i");
  }

  console.log(search_requirements);
  return search_requirements;
}

exports.searchPosts = async (req, res) => {
  var search_requirements = build_search_terms(req);

  try {
    const posts = await Post.find(search_requirements);
    if (!posts) {
      return res.status(404).json({ message: "Error" });
    }
    res.status(201).json(posts);
  } catch (err) {
    res.status(400).json({ message: err.message });
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

    // Add validation logging
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

    if (post.authorId.toString() !== req.userId.toString()) {
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