const crypto = require('crypto');
const Image = require('../models/Image');
const mongoose = require("mongoose");
const gridfsStream = require('gridfs-stream');
const { GridFSBucket } = require('mongodb');
const path = require('path');


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

exports.getImage = async(req, res) => {

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

}

exports.uploadImage = async(req, res) => {

    console.log(req.file);

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
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
        // File upload complete
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

}