// src/services/postService.js
import axios from "axios";

const API_URL = `https://${window.location.hostname}:5001/api/posts`;

// get all posts
export const getPosts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// get post by id
export const getPostById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// get posts by author
export const getPostsByAuthor = async (googleId) => {
  if (!googleId) {
    console.error("No Google ID provided.");
    return;
  }

  try {
    const response = await axios.get(`${API_URL}/author/${googleId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts by author:", error);
    throw error;
  }
};

// create post
export const createPost = async (postData) => {
  const response = await axios.post(API_URL, postData);
  return response.data;
};

// update post
export const updatePost = async (id, postData) => {
  console.log(
    "Sending update request for post ID:",
    id,
    "with data:",
    postData
  );
  const response = await axios.put(`${API_URL}/${id}`, postData);
  console.log("Update response:", response.data);
  return response.data;
};

// search posts
export const searchPosts = async (searchParameters) => {
  const response = await axios.get(`${API_URL}/search`, {
    params: { title: searchParameters },
  });
  return response.data;
};

// upload image
export const uploadImage = async (imageFile) => {
  if (!imageFile) {
    console.error("No image file provided.");
    return;
  }

  const formData = new FormData();
  formData.append("image", imageFile); // Append the image file to FormData

  // Perform the request to the server using fetch
  try {
    const response = await fetch(`${API_URL}/image`, {
      method: "POST",
      body: formData, // Send the FormData containing the image
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Image uploaded successfully:", data);
    return data.filename; // Return the filename
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};

export const bookmarkPost = async (userId, postId) => {
  try {
    const response = await axios.post(`${API_URL}/${userId}/${postId}/bookmark`);
    return response.data;
  } catch (error) {
    console.error("Failed to bookmark post", error);
    throw error;
  }
};

export const unbookmarkPost = async (userId, postId) => {
  try {
    const response = await axios.delete(`${API_URL}/${userId}/${postId}/bookmark`);
    return response.data;
  } catch (error) {
    console.error("Failed to unbookmark post", error);
    throw error;
  }
};

export const getBookmarkedPosts = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}/bookmarked`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch bookmarked posts", error);
    throw error;
  }
};

// src/services/postService.js
export const updateUserProfile = async (userId, bio, occupation) => {
  try {
    const response = await axios.put(`${API_URL}/${userId}/profile`, {
      bio,
      occupation,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update user profile", error);
    throw error;
  }
};
