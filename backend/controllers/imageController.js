const Image = require('../models/Image');
const mongoose = require("mongoose");
const gridfsStream = require('gridfs-stream');
const { GridFSBucket } = require('mongodb');

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

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    console.log(req.file.buffer);

    const fileName = req.body.name || req.file.originalname;
    const contentType = req.file.mimetype;

    // Create a GridFS stream to upload the file
    const writeStream = gridFSBucket.openUploadStream(fileName, {
        contentType,
    });

    // Write the file buffer to GridFS
    writeStream.end(req.file.buffer);

    writeStream.on('finish', (file) => {
        // File upload complete
        console.log(file);
        res.status(201).send(`File uploaded successfully`);
    });

    writeStream.on('error', (err) => {
        console.error('Error uploading file:', err);
        res.status(500).send('Error uploading file.');
    });

}