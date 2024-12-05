// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");
const { generalLimit, createPostLimit, imageDownloadLimit, imageUploadLimit } = require('../middleware/rateLimits');

// Routes requiring authentication
router.put("/:userId/profile", verifyToken, userController.updateUserProfile);
router.post(
  "/:userId/:postId/bookmark",
  verifyToken,
  userController.bookmarkPost
);
router.delete(
  "/:userId/:postId/bookmark",
  verifyToken,
  userController.unbookmarkPost
);
router.get(
  "/:userId/bookmarked",
  verifyToken,
  userController.getBookmarkedPosts
);

module.exports = router;
