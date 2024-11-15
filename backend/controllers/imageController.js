const crypto = require('crypto');
const Image = require('../models/Image');
const mongoose = require("mongoose");
const gridfsStream = require('gridfs-stream');
const { GridFSBucket } = require('mongodb');
const path = require('path');
const Post = require('../models/Post');

// Image storage
let gfs;
let gridFSBucket;
const conn = mongoose.connection;
conn.once('open', () => {
    // Initialize GridFS
    gfs = gridfsStream(conn.db, mongoose.mongo);
    gfs.collection('images'); // Name of the collection for storing files

    // Use the native MongoDB GridFSBucket API
    gridFSBucket = new GridFSBucket(conn.db, {
        bucketName: 'images', // GridFS collection
    });
});

// Get image from GridFS
exports.getImage = async (req, res) => {
    const file = await gfs.files.findOne({ filename: req.params.filename });

    if (!file || file.length === 0) {
        console.log("no file");
        return res.status(404).send('No file exists.');
    }

    // Check if the file is an image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
        // Stream the file from GridFS to the client
        const readStream = gridFSBucket.openDownloadStreamByName(file.filename);
        readStream.pipe(res);
    } else {
        res.status(404).send('Not an image.');
    }
};

// Allowed MIME types for image uploads
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

// Upload image to GridFS
exports.uploadImage = async (req, res) => {
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
        console.log(file);
        res.status(201).json({
            message: 'File uploaded successfully',
            filename: randomFileName
        });
    });

    writeStream.on('error', (err) => {
        console.error('Error uploading file:', err);
        res.status(500).send('Error uploading file.');
    });
};

exports.deletePostImage = async (req, res) => {
    try {
      const { id } = req.params;
      const { imageField } = req.body;
      
      // Fetch the existing post
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      // Only allow deletion of optional images
      if (imageField === 'postImage') {
        return res.status(400).json({ message: "Cannot delete required main image" });
      }
  
      // Verify the image field exists
      if (!['trackerImage', 'enclosureImage', 'attachmentImage'].includes(imageField)) {
        return res.status(400).json({ message: "Invalid image field" });
      }
  
      const filename = post[imageField];
      if (filename) {
        // Find and delete the file from GridFS
        const file = await gfs.files.findOne({ filename });
        if (file) {
          await new Promise((resolve, reject) => {
            gridFSBucket.delete(file._id, (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        }
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