import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        headers: config.headers
      });
    }

    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url
      });
    }
    return response;
  },
  error => {
    // Structured error handling
    const errorDetails = {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    };

    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', errorDetails);
    }

    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      switch (error.response.status) {
        case 401:
          // Handle unauthorized access
          localStorage.removeItem('token');
          // Only redirect if in browser environment
          if (typeof window !== 'undefined') {
            window.location.href = '/auth';
          }
          break;
          
        case 403:
          throw new Error('Access forbidden. Please check your permissions.');
          
        case 404:
          throw new Error('Resource not found. Please check the requested URL.');
          
        case 429:
          throw new Error('Too many requests. Please try again later.');
          
        case 500:
          throw new Error('Internal server error. Please try again later.');
          
        default:
          throw new Error(`API error: ${error.response.status}`);
      }
    } else if (error.request) {
      // Request made but no response received
      throw new Error('No response received from server. Please check your connection.');
    } else {
      // Error in request setup
      throw new Error(`Request failed: ${error.message}`);
    }

    return Promise.reject(error);
  }
);

// Optional: Add request timeout
apiClient.defaults.timeout = 10000; // 10 seconds

// Optional: Add response transformation
apiClient.defaults.transformResponse = [...axios.defaults.transformResponse, 
  data => {
    // You can add custom data transformation here
    return data;
  }
];

// Optional: Helper methods for common operations
const api = {
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data = {}, config = {}) => apiClient.post(url, data, config),
  put: (url, data = {}, config = {}) => apiClient.put(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
  patch: (url, data = {}, config = {}) => apiClient.patch(url, data, config)
};

export default api;