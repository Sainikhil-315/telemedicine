const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Availability = require('../models/Availability');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
exports.getDoctors = asyncHandler(async (req, res, next) => {
  const query = {};

  // Apply filters dynamically
  if (req.query.name) {
    query.name = { $regex: req.query.name, $options: 'i' };
  }

  if (req.query.specialty) {
    query.specialty = { $regex: req.query.specialty, $options: 'i' };
  }

  try {
    const doctors = await Doctor.find(query);

    if (!doctors.length) {
      return next(new ErrorResponse('No doctors found matching the criteria', 404));
    }

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
    // console.log("Query Params: ", req.query);

  } catch (error) {
    next(error);
  }
});


// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctor = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    return next(
      new ErrorResponse(`Doctor not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: doctor
  });
});

// @desc    Create doctor profile
// @route   POST /api/doctors
// @access  Private
exports.createDoctor = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  // Check if doctor profile already exists
  const existingDoctor = await Doctor.findOne({ user: req.user.id });

  if (existingDoctor) {
    return next(
      new ErrorResponse(`You already have a doctor profile`, 400)
    );
  }

  // Check if user is a doctor
  const user = await User.findById(req.user.id);
  if (user.role !== 'doctor') {
    return next(
      new ErrorResponse(`Only doctors can create a doctor profile`, 403)
    );
  }

  const doctor = await Doctor.create(req.body);

  res.status(201).json({
    success: true,
    data: doctor
  });
});

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private
exports.updateDoctor = asyncHandler(async (req, res, next) => {
  let doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    return next(
      new ErrorResponse(`Doctor not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is doctor owner
  if (doctor.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this doctor profile`,
        401
      )
    );
  }

  doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: doctor
  });
});

// @desc    Delete doctor profile
// @route   DELETE /api/doctors/:id
// @access  Private
exports.deleteDoctor = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    return next(
      new ErrorResponse(`Doctor not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is doctor owner
  if (doctor.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this doctor profile`,
        401
      )
    );
  }

  await doctor.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Add doctor availability
// @route   POST /api/doctors/:id/availability
// @access  Private
exports.addAvailability = asyncHandler(async (req, res, next) => {
  req.body.doctor = req.params.id;

  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    return next(
      new ErrorResponse(`Doctor not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is doctor owner
  if (doctor.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add availability to this doctor`,
        401
      )
    );
  }

  // Check if availability already exists for this day
  const existingAvailability = await Availability.findOne({
    doctor: req.params.id,
    day: req.body.day
  });

  if (existingAvailability) {
    return next(
      new ErrorResponse(`Availability for ${req.body.day} already exists`, 400)
    );
  }

  const availability = await Availability.create(req.body);

  res.status(201).json({
    success: true,
    data: availability
  });
});


// @desc    Get doctor availabilities
// @route   GET /api/doctors/:id/availability
// @access  Public
exports.getAvailabilities = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.id).select('availability');

  if (!doctor) {
    return res.status(404).json({
      success: false,
      message: 'Doctor not found'
    });
  }

  res.status(200).json({
    success: true,
    count: doctor.availability.length,
    data: doctor.availability
  });
});
