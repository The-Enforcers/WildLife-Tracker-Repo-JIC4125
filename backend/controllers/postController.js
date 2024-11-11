const Post = require("../models/Post");
const User = require("../models/User");
//returns all posts
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get all posts by a specific author
exports.getPostsByAuthorId = async (req, res) => {
  try {
    const posts = await Post.find({ authorId: req.params.authorId });
    if (posts.length === 0) {
      return res
        .status(404)
        .json({ message: "No posts found for this author" });
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
    authorId,
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
    authorId,
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


// Add nut muncher easter egg soon
// please

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
      {title: new RegExp(title, "i")},
      {scientificName: new RegExp(title, "i")},
      {commonName: new RegExp(title, "i")},
      {author: new RegExp(title, "i")}
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
    res.status(400);
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

    // Preserve existing image fields if not provided in the update
    ["postImage", "trackerImage", "enclosureImage", "attachmentImage"].forEach(
      (field) => {
        if (!updateData[field]) {
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
        console.log("hasUserLikedPost called");
        const { postId } = req.params;
        console.log("PostId:", postId);
        
        // Get userId from decoded token's id field
        const userId = req.userId;  // This matches what your auth middleware provides
        console.log("UserId:", userId);

        const post = await Post.findById(postId);
        console.log("Found post:", post);
        
        if (!post) {
            console.log("Post not found");
            return res.status(404).json({ message: "Post not found" });
        }

        console.log("Post likes array:", post.likes);
        const hasLiked = post.likes.map(id => id.toString()).includes(userId.toString());
        console.log("Has liked:", hasLiked);
        
        res.json({ hasLiked });
    } catch (err) {
        console.error("Error in hasUserLikedPost:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.likePost = async (req, res) => {
    try {
        console.log("likePost called");
        const { postId } = req.params;
        console.log("PostId:", postId);
        
        // Get userId from decoded token's id field
        const userId = req.userId;  // This matches what your auth middleware provides
        console.log("UserId:", userId);

        const post = await Post.findById(postId);
        console.log("Found post:", post);

        if (!post) {
            console.log("Post not found");
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if user already liked the post
        console.log("Current likes:", post.likes);
        const alreadyLiked = post.likes.map(id => id.toString()).includes(userId.toString());
        console.log("Already liked:", alreadyLiked);

        if (alreadyLiked) {
            return res.status(400).json({ message: "Post already liked by user" });
        }

        // Add like to post
        post.likes.push(userId);
        post.likeCount = post.likes.length;
        await post.save();
        console.log("Updated post:", post);

        res.json({ message: "Post liked successfully", likeCount: post.likeCount });
    } catch (err) {
        console.error("Error in likePost:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.unlikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.userId;  // This matches what your auth middleware provides

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Remove like from post
        post.likes = post.likes.filter(id => id.toString() !== userId.toString());
        post.likeCount = post.likes.length;
        await post.save();

        res.json({ message: "Post unliked successfully", likeCount: post.likeCount });
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
        averageLikes: posts.length > 0 ? totalLikes / posts.length : 0
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};
  

