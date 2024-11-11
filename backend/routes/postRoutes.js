const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const imageController = require("../controllers/imageController");
const multer = require("multer");
const verifyToken = require("../middleware/authMiddleware");  // Import the verifyToken middleware

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});




router.get("/search", postController.searchPosts);
router.get("/", postController.getAllPosts);
router.post("/", verifyToken, postController.createPost);  // Protect the create post route
router.get("/:id", postController.getPostById);
router.put("/:id", postController.updatePost);
router.post("/image", verifyToken, upload.single("image"), imageController.uploadImage);  // Protect image upload route
router.get("/image/:filename", imageController.getImage);
router.get("/author/:authorId", postController.getPostsByAuthorId);
router.post("/:postId/like", verifyToken, postController.likePost);
router.delete("/:postId/like", verifyToken, postController.unlikePost);
router.get("/:postId/hasLiked", verifyToken, postController.hasUserLikedPost);
router.get("/author/:userId/likes", postController.getUserPostsLikes);

module.exports = router;
