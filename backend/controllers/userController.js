// controllers/userController.js
const User = require("../models/User");

// Update user bio and occupation
exports.updateUserProfile = async (req, res) => {
  const { bio, occupation } = req.body;

  try {
    // Ensure the user can only update their own profile
    if (req.params.userId !== req.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { bio, occupation },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a bookmark
exports.bookmarkPost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Ensure the user can only modify their own bookmarks
    if (req.params.userId !== req.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.bookmarkedPosts.includes(postId)) {
      user.bookmarkedPosts.push(postId);
      await user.save();
    }

    res.status(200).json({ message: "Post bookmarked successfully" });
  } catch (err) {
    console.error("Error in bookmarkPost:", err);
    res.status(500).json({
      message: "An error occurred while bookmarking the post",
    });
  }
};

// Remove a bookmark
exports.unbookmarkPost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Ensure the user can only modify their own bookmarks
    if (req.params.userId !== req.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.bookmarkedPosts = user.bookmarkedPosts.filter(
      (bookmark) => bookmark.toString() !== postId
    );
    await user.save();

    res.status(200).json({ message: "Post unbookmarked successfully" });
  } catch (err) {
    console.error("Error in unbookmarkPost:", err);
    res.status(500).json({
      message: "An error occurred while unbookmarking the post",
    });
  }
};

// Get all bookmarked posts
exports.getBookmarkedPosts = async (req, res) => {
  try {
    // Ensure the user can only access their own bookmarks
    if (req.params.userId !== req.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.userId).populate("bookmarkedPosts");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.bookmarkedPosts);
  } catch (err) {
    console.error("Error in getBookmarkedPosts:", err);
    res.status(500).json({
      message: "An error occurred while retrieving bookmarked posts",
    });
  }
};

exports.getUserInfo = async (req, res) => {

  try {

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const user_requested = new User({
      _id: user._id, 
      googleId: null,
      displayName: user.displayName,
      email: null,
      picture: user.picture,
      bio: user.bio,
      occupation: user.occupation,
      bookmarkedPosts: null,
      createdAt: user.createdAt
    });

    res.status(200).json(user_requested);
  } catch (err) {
    console.error("Error in getBookmarkedPosts:", err);
    res.status(500).json({
      message: "An error occurred while retrieving bookmarked posts",
    });
  }

}