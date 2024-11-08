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
    search_requirements.title = new RegExp(title, "i");
  }

  if (scientificName) {
    search_requirements.scientificName = new RegExp(scientificName, "i");
  }

  if (commonName) {
    search_requirements.commonName = new RegExp(commonName, "i");
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



