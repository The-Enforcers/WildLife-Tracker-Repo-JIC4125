// backend/controllers/postController.js
const Post = require('../models/Post');

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createPost = async (req, res) => {
    console.log(req.body);
    const { title, scientificName, commonName, animalType, trackerType, dataTypes, enclosureType, attachmentType, recommendations } = req.body;
    const newPost = new Post({ title, scientificName, commonName, animalType, trackerType, dataTypes, enclosureType, attachmentType, recommendations });

    console.log(newPost);

    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

function build_search_terms(req) {
    console.log(req.query);

    const { title, scientificName, commonName, animalType, trackerType, dataTypes, enclosureType, attachmentType, recommendations } = req.query;

    var search_requirements = {};

    if (title) {
        search_requirements.title = new RegExp(title, 'i');
    }

    if (scientificName) {
        search_requirements.scientificName = new RegExp(scientificName, 'i');
    }

    if (commonName) {
        search_requirements.commonName = new RegExp(commonName, 'i');
    }

    if (animalType) {
        search_requirements.animalType = { $in: animalType.split(",") };
    }

    if (trackerType) {
        search_requirements.trackerType = { $in: trackerType.split(',') };
    }

    if (dataTypes) {
        search_requirements.dataTypes = { $in: dataTypes.split(',') };
    }

    if (enclosureType) {
        search_requirements.enclosureType = new RegExp(enclosureType, 'i');
    }

    if (attachmentType) {
        search_requirements.attachmentType = { $in: attachmentType.split(',') };;
    }

    if (recommendations) {
        search_requirements.recommendations = new RegExp(recommendations, 'i');
    }

    console.log(search_requirements);
    return search_requirements;
}

exports.searchPosts = async(req, res) => {

    var search_requirements = build_search_terms(req);

    try {

        const posts = await Post.find(search_requirements);
        if (!posts) {
            return res.status(404).json( { message: 'Error' });
        }
        res.status(201).json(posts);

    } catch (err) {
        res.status(400)
    }

}
