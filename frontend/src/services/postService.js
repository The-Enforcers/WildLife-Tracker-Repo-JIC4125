// postService.js

import axios from "axios";

const API_URL = `https://${window.location.hostname}:5001/api`;

// Helper function to get token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const getUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/posts/author/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with id ${userId}:`, error);
    throw error;
  }
};

// Get all posts
export const getPosts = async (page = 1, limit = 12) => {
  try {
    const response = await axios.get(`${API_URL}/posts?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all posts:", error);
    throw error;
  }
};

// Get post by id
export const getPostById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post with id ${id}:`, error);
    throw error;
  }
};

// Get posts by author (using user._id)
export const getPostsByAuthor = async (userId, page = 1, limit = 12) => { // Changed parameter from googleId to userId
  if (!userId) {
    console.error("No User ID provided.");
    return;
  }

  try {
    const response = await axios.get(`${API_URL}/posts/author/posts/${userId}?page=${page}&limit=${limit}`);
    
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn("No posts found for this author.");
      return []; // Return an empty array if no posts are found
    }
    console.error("Error fetching posts by author:", error);
    throw error;
  }
};

// Create post
export const createPost = async (postData) => {
  const token = getAuthToken();
  try {
    const response = await axios.post(`${API_URL}/posts`, postData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// Update post
export const updatePost = async (id, postData) => {
  const token = getAuthToken();
  try {
    const response = await axios.put(`${API_URL}/posts/${id}`, postData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log(
      "Sending update request for post ID:",
      id,
      "with data:",
      postData
    );
    console.log("Update response:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating post with id ${id}:`, error);
    throw error;
  }
};

// Search posts
export const searchPosts = async ({
  page = 1,
  limit = 12,
  search = '',
  filters = {}
}) => {
  try {
    // Convert filters object to query parameters
    const trackerTypes = [];
    const attachmentTypes = [];
    const enclosureTypes = [];
    const animalFamily = [];
  
    // Build arrays based on selected filters
    if (filters.vhf) trackerTypes.push("VHF");
    if (filters.satellite) trackerTypes.push("Satellite");
    if (filters.lora) trackerTypes.push("LoRa");
    if (filters.acoustic) trackerTypes.push("Acoustic");
    if (filters.cell) trackerTypes.push("Cellular / GSM");
    if (filters.bio) trackerTypes.push("Bio-logger");
    if (filters.rfid) trackerTypes.push("RFID");
  
    if (filters.encapsulated) enclosureTypes.push("Encapsulated");
    if (filters.potting) enclosureTypes.push("Potting");
    if (filters.shrink) enclosureTypes.push("Shrink wrap");
    if (filters.hematic) enclosureTypes.push("Hematic seal");
  
    if (filters.bolt) attachmentTypes.push("Bolt");
    if (filters.harness) attachmentTypes.push("Harness");
    if (filters.collar) attachmentTypes.push("Collar");
    if (filters.adhesive) attachmentTypes.push("Adhesive");
    if (filters.implant) attachmentTypes.push("Implant");
  
    if (filters.mammal) animalFamily.push("Mammal");
    if (filters.reptile) animalFamily.push("Reptile");
    if (filters.amphibian) animalFamily.push("Amphibians");
    if (filters.fish) animalFamily.push("Fish");
    if (filters.bird) animalFamily.push("Bird");

    // Determine sort parameter
    let sortParam = 'newToOld';
    if (filters.oldToNew) sortParam = 'oldToNew';
    if (filters.mostLiked) sortParam = 'mostLiked';

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      title: search,
      sort: sortParam,
      trackerType: trackerTypes.join(','),
      attachmentType: attachmentTypes.join(','),
      enclosureType: enclosureTypes.join(','),
      animalType: animalFamily.join(',')
    });

    const response = await axios.get(`${API_URL}/posts/search?${params}`);
    return response.data;
  } catch (error) {
    console.error("Error searching posts:", error);
    throw error;
  }
};

// Upload image
export const uploadImage = async (imageFile) => {
  if (!imageFile) {
    console.error("No image file provided.");
    return;
  }

  const token = getAuthToken();
  const formData = new FormData();
  formData.append("image", imageFile); // Append the image file to FormData

  // Perform the request to the server using fetch
  try {
    const response = await fetch(`${API_URL}/posts/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
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
    throw error;
  }
};

// Bookmark a post
export const bookmarkPost = async (userId, postId) => { // Ensure userId is the MongoDB _id
  try {
    const token = getAuthToken();
    const response = await axios.post(`${API_URL}/user/${userId}/${postId}/bookmark`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to bookmark post:", error);
    throw error;
  }
};

// Unbookmark a post
export const unbookmarkPost = async (userId, postId) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`${API_URL}/user/${userId}/${postId}/bookmark`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to unbookmark post:", error);
    throw error;
  }
};

// Get bookmarked posts
export const getBookmarkedPosts = async (userId) => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_URL}/user/${userId}/bookmarked`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch bookmarked posts:", error);
    throw error;
  }
};

// Update user profile bio and occupation
export const updateUserProfile = async (userId, bio, occupation) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(`${API_URL}/user/${userId}/profile`, {
      bio,
      occupation,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update user profile:", error);
    throw error;
  }
};

// Delete image from a post
export const deleteImage = async (postId, imageField) => {
  const token = getAuthToken();
  console.log('DeleteImage called with:', { postId, imageField });
  
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: { imageField } // Send imageField in the request body
    };
    console.log('Making delete request with config:', config);

    const response = await axios.delete(`${API_URL}/posts/${postId}/image`, config);
    console.log('Delete response:', response.data);
    return response.data;
  } catch (error) {
    console.error("Full error object:", error);
    if (error.response) {
      console.error("Response error data:", error.response.data);
      console.error("Response error status:", error.response.status);
      throw new Error(error.response.data.message || 'Failed to delete image');
    }
    throw new Error('Network error while deleting image');
  }
};

// Delete a post
// PostService.js

export const deletePost = async (id) => {
  try {
    const token = getAuthToken();
    console.log(`Attempting to delete post with ID: ${id}. Retrieved token: ${token}`);

    if (!token) {
      console.error('No token found in localStorage');
      throw new Error('No token found in localStorage');
    }

    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log(`Delete request sent. Response status: ${response.status}`);

    if (!response.ok) {
      let errorMessage = 'Failed to delete post';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (err) {
        errorMessage = `${response.status} ${response.statusText}`;
      }
      console.error(`Delete failed: ${errorMessage}`);
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('Delete successful:', data);
    return data; 
  } catch (error) {
    console.error('Error in deletePost:', error);
    throw error;
  }
};