import axios from "axios";

const API_URL = `https://${window.location.hostname}:5001/api`;

// Helper function to get token
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// get all posts
export const getPosts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// get post by id
export const getPostById = async (id) => {
  const response = await axios.get(`${API_URL}/posts/${id}`);
  return response.data;
};

export const getPostsByAuthor = async (googleId) => {
  if (!googleId) {
    console.error("No Google ID provided.");
    return;
  }

  try {
    const response = await axios.get(`${API_URL}/posts/author/${googleId}`);
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


// create post
export const createPost = async (postData) => {
  const token = getAuthToken();
  const response = await axios.post(`${API_URL}/posts`, postData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

// update post
export const updatePost = async (id, postData) => {
  const token = getAuthToken();
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
};

// search posts
export const searchPosts = async (searchParameters) => {
  const response = await axios.get(`${API_URL}/posts/search`, {
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
  }
};

export const bookmarkPost = async (userId, postId) => {
  try {
    const response = await axios.post(`${API_URL}/user/${userId}/${postId}/bookmark`);
    return response.data;
  } catch (error) {
    console.error("Failed to bookmark post", error);
    throw error;
  }
};

export const unbookmarkPost = async (userId, postId) => {
  try {
    const response = await axios.delete(`${API_URL}/user/${userId}/${postId}/bookmark`);
    return response.data;
  } catch (error) {
    console.error("Failed to unbookmark post", error);
    throw error;
  }
};

export const getBookmarkedPosts = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}/bookmarked`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch bookmarked posts", error);
    throw error;
  }
};

// updates user profile bio and occupation
export const updateUserProfile = async (userId, bio, occupation) => {
  try {
    const response = await axios.put(`${API_URL}/user/${userId}/profile`, {
      bio,
      occupation,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update user profile", error);
    throw error;
  }
};

export const deleteImage = async (postId, imageField) => {
  const token = getAuthToken();
  console.log('DeleteImage called with:', { postId, imageField });
  
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: { imageField }
    };
    console.log('Making delete request with config:', config);

    const response = await axios.delete(`${API_URL}/posts/${postId}/image`, config);
    console.log('Delete response:', response);
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