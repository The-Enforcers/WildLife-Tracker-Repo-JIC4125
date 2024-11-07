// backend/routes/postRoutes.js
const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const imageController = require("../controllers/imageController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/search", postController.searchPosts);
router.get("/", postController.getAllPosts);
router.post("/", postController.createPost);
router.get("/:id", postController.getPostById);
router.put("/:id", postController.updatePost);
router.post("/image", upload.single("image"), imageController.uploadImage);
router.get("/image/:filename", imageController.getImage);
router.get("/author/:authorId", postController.getPostsByAuthorId);

module.exports = router;
