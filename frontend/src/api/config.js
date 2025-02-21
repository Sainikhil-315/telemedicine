// config.js
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json'
};
export const UPLOAD_HEADERS = {
  'Content-Type': 'multipart/form-data'
};