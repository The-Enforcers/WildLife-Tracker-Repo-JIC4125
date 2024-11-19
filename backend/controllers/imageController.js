// controllers/imageController.js

const crypto = require('crypto');
const Image = require('../models/Image'); // Ensure this model is defined if used
const mongoose = require("mongoose");
const path = require('path');
const Post = require('../models/Post');
const { getGfs, getGridFSBucket } = require('../utils/gridFs'); // Import the utility functions

// Allowed MIME types for image uploads
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

/**
 * Get Image from GridFS
 */
exports.getImage = async (req, res) => {
  try {
    const gfs = getGfs();
    const gridFSBucket = getGridFSBucket();

    if (!gfs || !gridFSBucket) {
      console.error('GridFS is not initialized.');
      return res.status(500).send('GridFS is not initialized.');
    }

    const file = await gfs.files.findOne({ filename: req.params.filename });

    if (!file) {
      console.log("No file found with filename:", req.params.filename);
      return res.status(404).send('No file exists.');
    }

    // Check if the file is an image
    if (allowedMimeTypes.includes(file.contentType)) {
      // Stream the file from GridFS to the client
      const readStream = gridFSBucket.openDownloadStreamByName(file.filename);
      readStream.pipe(res);
    } else {
      res.status(404).send('Not an image.');
    }
  } catch (err) {
    console.error('Error retrieving image:', err);
    res.status(500).send('Server error.');
  }
};

/**
 * Upload Image to GridFS
 */
exports.uploadImage = async (req, res) => {
  try {
    const gfs = getGfs();
    const gridFSBucket = getGridFSBucket();

    if (!gfs || !gridFSBucket) {
      console.error('GridFS is not initialized.');
      return res.status(500).send('GridFS is not initialized.');
    }

    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    // Dynamically import file-type for compatibility
    const { fileTypeFromBuffer } = await import('file-type');
    const fileSignature = await fileTypeFromBuffer(req.file.buffer);

    // Validate MIME type and file signature
    if (!fileSignature || !allowedMimeTypes.includes(fileSignature.mime)) {
      return res.status(400).send('Invalid file type. Only JPEG, PNG, and GIF files are allowed.');
    }

    const randomBytes = crypto.randomBytes(16).toString('hex');
    const fileExtension = path.extname(req.file.originalname);
    const randomFileName = `${randomBytes}${fileExtension}`;
    const contentType = req.file.mimetype;

    // Create a GridFS stream to upload the file
    const writeStream = gridFSBucket.openUploadStream(randomFileName, {
      contentType,
    });

    // Write the file buffer to GridFS
    writeStream.end(req.file.buffer);

    writeStream.on('finish', (file) => {
      console.log('File uploaded:', file);
      res.status(201).json({
        message: 'File uploaded successfully',
        filename: randomFileName
      });
    });

    writeStream.on('error', (err) => {
      console.error('Error uploading file:', err);
      res.status(500).send('Error uploading file.');
    });
  } catch (err) {
    console.error('Error in uploadImage:', err);
    res.status(500).send('Server error.');
  }
};

/**
 * Delete Post Image
 */
exports.deletePostImage = async (req, res) => {
  try {
    const gfs = getGfs();
    const gridFSBucket = getGridFSBucket();

    if (!gfs || !gridFSBucket) {
      console.error('GridFS is not initialized.');
      return res.status(500).send('GridFS is not initialized.');
    }

    const { id } = req.params; // Post ID
    const { imageField } = req.body; // e.g., 'trackerImage', 'enclosureImage', 'attachmentImage'

    // Fetch the existing post
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Authorization check: Ensure the requester is the author of the post
    if (post.authorId.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Only allow deletion of optional images
    if (imageField === 'postImage') {
      return res.status(400).json({ message: "Cannot delete required main image" });
    }

    // Verify the image field exists and is valid
    const validImageFields = ['trackerImage', 'enclosureImage', 'attachmentImage'];
    if (!validImageFields.includes(imageField)) {
      return res.status(400).json({ message: "Invalid image field" });
    }

    const filename = post[imageField];
    if (filename) {
      // Find and delete the file from GridFS
      const file = await gfs.files.findOne({ filename });
      if (file) {
        await new Promise((resolve, reject) => {
          gridFSBucket.delete(file._id, (err) => {
            if (err) {
              console.error(`Error deleting file ${filename} from GridFS:`, err);
              reject(err);
            } else {
              console.log(`File ${filename} deleted from GridFS.`);
              resolve();
            }
          });
        });
      } else {
        console.warn(`File ${filename} not found in GridFS.`);
      }
    } else {
      console.warn(`No filename found for image field ${imageField} in post ${id}.`);
    }

    // Update the post to remove the image reference
    const updateData = {
      [imageField]: null,
      lastUpdated: new Date()
    };

    const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
      new: true
    });

    res.json(updatedPost);
  } catch (err) {
    console.error('Error in deletePostImage:', err);
    res.status(500).json({ message: err.message });
  }
};
