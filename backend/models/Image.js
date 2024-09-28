const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    name: String,
    imageUrl: String,
  });
  
const ImageModel = mongoose.model('Image', ImageSchema);