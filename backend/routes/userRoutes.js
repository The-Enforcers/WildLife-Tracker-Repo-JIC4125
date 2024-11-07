// backend/routes/postRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.put("/:userId/profile", userController.updateUserProfile);
router.post("/:userId/:id/bookmark", userController.bookmarkPost);
router.delete("/:userId/:id/bookmark", userController.unbookmarkPost);
router.get("/:userId/bookmarked", userController.getBookmarkedPosts);

module.exports = router;
