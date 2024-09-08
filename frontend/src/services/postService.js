// src/services/postService.js
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/posts';

export const getPosts = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getPostById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createPost = async (postData) => {
    const response = await axios.post(API_URL, postData);
    return response.data;
};
