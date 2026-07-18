import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api', 
});

// Interceptor to automatically attach JWT security tokens to incoming traffic
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;