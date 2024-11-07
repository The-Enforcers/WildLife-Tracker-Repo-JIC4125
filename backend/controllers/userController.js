const User = require("../models/User");

// Update user bio and occupation
exports.updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { bio, occupation } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
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
    const { userId, id: postId } = req.params; // Retrieve userId and postId from params

    const user = await User.findById(userId);
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
    res
      .status(500)
      .json({ message: "An error occurred while bookmarking the post" });
  }
};

// Remove a bookmark
exports.unbookmarkPost = async (req, res) => {
  try {
    const { userId, id: postId } = req.params;

    const user = await User.findById(userId);
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
    res
      .status(500)
      .json({ message: "An error occurred while unbookmarking the post" });
  }
};

// Get all bookmarked posts
exports.getBookmarkedPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate("bookmarkedPosts");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.bookmarkedPosts);
  } catch (err) {
    console.error("Error in getBookmarkedPosts:", err);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving bookmarked posts" });
  }
};
