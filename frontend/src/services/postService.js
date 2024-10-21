// src/services/postService.js
import axios from 'axios';

const API_URL = `https://${window.location.hostname}:5001/api/posts`;

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

export const searchPosts = async (searchParameters) => {
    const response = await axios.get(`${API_URL}/search`);
    return response.data;
};

export const updatePost = async (id, postData) => {
    console.log("Sending update request for post ID:", id, "with data:", postData);
    const response = await axios.put(`${API_URL}/${id}`, postData);
    console.log("Update response:", response.data);
    return response.data;
};

export const uploadImage = async (imageFile) => {
    if (!imageFile) {
        console.error('No image file provided.');
        return;
    }

    const formData = new FormData();
    formData.append('image', imageFile); // Append the image file to FormData

    // Perform the request to the server using fetch
    try {
        const response = await fetch(`${API_URL}/image`, {
            method: 'POST',
            body: formData, // Send the FormData containing the image
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Image uploaded successfully:', data);
        return data.filename; // Return the filename
    } catch (error) {
        console.error('Error uploading image:', error);
    }
};
