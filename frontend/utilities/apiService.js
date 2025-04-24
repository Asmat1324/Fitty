//utilities/apiService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

// Create an axios instance
const api = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with a status code outside of 2xx
      console.log('Response error:', error.response.data);
      
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        // You could trigger a logout or token refresh here
      }
      
    } else if (error.request) {
      // Request was made but no response received
      console.log('Network error - no response received');
    } else {
      // Something else happened while setting up the request
      console.log('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

// Post functions
export const fetchPosts = async () => {
  try {
    const response = await api.get('/api/posts');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    throw error;
  }
};

export const createPost = async (imageUri, caption) => {
  try {
    const formData = new FormData();
    
    // Get image name from URI
    const imageName = imageUri.split('/').pop();
    const imageType = imageName.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
    
    formData.append('image', {
      uri: imageUri,
      name: imageName,
      type: imageType,
    });
    
    if (caption) {
      formData.append('caption', caption);
    }
    
    const response = await api.post('/api/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to create post:', error);
    throw error;
  }
};

export const likePost = async (postId) => {
  try {
    const response = await api.put(`/api/posts/like/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to like post:', error);
    throw error;
  }
};

export const unlikePost = async (postId) => {
  try {
    const response = await api.put(`/api/posts/unlike/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to unlike post:', error);
    throw error;
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await api.delete(`/api/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to delete post:', error);
    throw error;
  }
};

export default api;