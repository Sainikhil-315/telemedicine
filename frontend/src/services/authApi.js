import axios from "./index"; // Import Axios instance

// User Login
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post("/api/auth/login", credentials);
    return response.data; // Returns token & user info
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
};

// User Registration
export const registerUser = async (userData) => {
  try {
    const response = await axios.post("/api/auth/register", userData);
    return response.data; // Returns success message
  } catch (error) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

// Fetch Current User Profile (Protected Route)
export const getCurrentUser = async () => {
  try {
    const response = await axios.get("/api/auth/me");
    return response.data; // Returns user object
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch user data" };
  }
};

// Logout (Handled Client-Side)
export const logoutUser = () => {
  localStorage.removeItem("token"); // Remove token from storage
};
