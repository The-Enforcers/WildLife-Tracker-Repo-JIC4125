// utils/gridFs.js
const mongoose = require('mongoose');
const gridfsStream = require('gridfs-stream');
const { GridFSBucket } = require('mongodb');

let gfs;
let gridFSBucket;

const conn = mongoose.connection;

conn.once('open', () => {
  // Initialize GridFS
  gridFSBucket = new GridFSBucket(conn.db, {
    bucketName: 'images', // GridFS collection
  });

  gfs = gridfsStream(conn.db, mongoose.mongo);
  gfs.collection('images'); // Name of the collection for storing files
});

function getGfs() {
  return gfs;
}

function getGridFSBucket() {
  return gridFSBucket;
}

module.exports = {
  getGfs,
  getGridFSBucket,
};
