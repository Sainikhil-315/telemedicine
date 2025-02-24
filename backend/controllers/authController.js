const User = require('../models/User');
const Doctor = require('../models/Doctor');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      role,
      phone,
      address,
      specialty,
      experience,
      consultationFee,
      qualifications,
      hospital,
      rating,
      reviewCount,
      availability
    } = req.body;

    // 1️⃣ First, create the user
    const user = await User.create({ name, username, email, password, role, phone, address });

    // 2️⃣ If the user is a doctor, create a doctor profile
    if (role === 'doctor') {
      const doctor = await Doctor.create({
        user: user._id,
        name,
        username,
        email,
        specialty,
        experience,
        consultationFee,
        qualifications,
        hospital,
        rating,
        reviewCount,
        password,
        phone,
        availability
      });
      const token = doctor.getSignedJwtToken();
      
      // ✅ Return after sending response to prevent multiple responses
      return res.status(201).json({ 
        success: true, 
        token, 
        role: doctor.role,
        user: {
          id: doctor._id,
          name: doctor.name,
          email: doctor.email,
          role: doctor.role
        }
      });
    }

    // 3️⃣ Generate token and send response for regular users
    const token = user.getSignedJwtToken();
    res.status(201).json({ 
      success: true, 
      token, 
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: error.message });
  }
};


// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Log user out
// @route   GET /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res, next) => {
    // No need to clear cookies since we're using localStorage
    res.status(200).json({ success: true, data: {} });
});


// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
});

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: user });
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});


// Helper function to send token
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};
exports.getDataWithToken = async (req, res) => {
  try {
    // Force fresh response, prevent caching
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");

    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Token not provided");
      return res.status(400).json({ success: false, message: "Token not provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token

    // Verify token
    const decoded = jwt.verify(token, "nikhil");

    // Fetch user data
    const data = await User.findById(decoded.id).select("-password");

    if (!data) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data });

  } catch (error) {
    console.error("Error verifying token:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
exports.checkAuthStatus = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Token not provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "nikhil");

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
