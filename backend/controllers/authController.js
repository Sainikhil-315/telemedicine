const User = require('../models/User');
const Doctor = require('../models/Doctor');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const mongoose = require('mongoose');

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
        res.status(201).json({ 
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
  
      // 3️⃣ Generate token and send response
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