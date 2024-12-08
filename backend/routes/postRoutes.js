// routes/postRoutes.js
const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const imageController = require("../controllers/imageController");
const userController = require("../controllers/userController");
const multer = require("multer");
const verifyToken = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { generalLimit, createPostLimit, imageDownloadLimit, imageUploadLimit } = require('../middleware/rateLimits');
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Public routes
router.get("/search", postController.searchPosts);
router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.get("/image/:filename", imageDownloadLimit, imageController.getImage);
router.get("/author/posts/:authorId", postController.getPostsByAuthorId);
router.get("/author/:userId/likes", postController.getUserPostsLikes);
router.get("/author/:userId", userController.getUserInfo);

// Routes requiring authentication
router.post("/", verifyToken, createPostLimit, postController.createPost);
router.put("/:id", verifyToken, createPostLimit, postController.updatePost);
router.delete("/:id", verifyToken, async (req, res, next) => {
    console.log(`Delete route hit with ID: ${req.params.id}`);
    console.log('User ID from token:', req.userId);
    next();
  }, postController.deletePost);
router.post(
  "/image",
  verifyToken,
  imageUploadLimit,
  upload.single("image"),
  imageController.uploadImage
);
router.delete("/:id/image", verifyToken, imageController.deletePostImage);

// Like and unlike posts
router.post("/:postId/like", verifyToken, postController.likePost);
router.delete("/:postId/like", verifyToken, postController.unlikePost);
router.get("/:postId/hasLiked", verifyToken, postController.hasUserLikedPost);

// Report and unreport posts
router.post("/:postId/report", postController.reportPost);
router.delete("/:postId/report", postController.unreportPost);
router.get("/:postId/hasReported", postController.hasUserReportedPost);


module.exports = router;
