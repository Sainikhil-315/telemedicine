const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Availability = require('../models/Availability');
const Notification = require('../models/Notification');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { isSlotAvailable } = require('../utils/timeSlotHelpers');
const { sendAppointmentEmail } = require('../utils/emailService');
const { sendAppointmentSMS } = require('../utils/smsService');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = asyncHandler(async (req, res, next) => {
  // If user is not admin, they can only see their own appointments
  if (req.user.role !== 'admin') {
    if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user.id });
      if (!doctor) {
        return next(
          new ErrorResponse(`No doctor profile found for this user`, 404)
        );
      }
      req.query.doctor = doctor._id;
    } else {
      req.query.patient = req.user.id;
    }
  }

  res.status(200).json(res.advancedResults);
});

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointment = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate({
      path: 'patient',
      select: 'name email phone'
    })
    .populate({
      path: 'doctor',
      select: 'specialization consultationFee',
      populate: {
        path: 'user',
        select: 'name email'
      }
    });

  if (!appointment) {
    return next(
      new ErrorResponse(`Appointment not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is appointment owner or doctor
  if (
    appointment.patient._id.toString() !== req.user.id &&
    appointment.doctor.user._id.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this appointment`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: appointment
  });
});

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = asyncHandler(async (req, res, next) => {
  // Add patient from JWT token
  req.body.patient = req.user.id;

  // Check if doctor exists
  const doctor = await Doctor.findById(req.body.doctor);
  if (!doctor) {
    return next(
      new ErrorResponse(`Doctor not found with id of ${req.body.doctor}`, 404)
    );
  }

  // Check if the selected time slot is available
  const isAvailable = await isSlotAvailable(
    req.body.doctor,
    req.body.date,
    req.body.startTime,
    req.body.endTime
  );

  if (!isAvailable) {
    return next(
      new ErrorResponse(`The selected time slot is not available`, 400)
    );
  }

  const appointment = await Appointment.create(req.body);

  // Create notification for doctor
  await Notification.create({
    recipient: doctor.user,
    sender: req.user.id,
    type: 'appointment',
    title: 'New Appointment',
    message: `A new appointment has been scheduled for ${new Date(req.body.date).toLocaleDateString()} at ${req.body.startTime}`,
    relatedTo: {
      model: 'Appointment',
      id: appointment._id
    },
    deliveryMethod: 'all'
  });

  // Send email notification
  sendAppointmentEmail({
    email: req.user.email,
    subject: 'Appointment Confirmation',
    message: `Your appointment with Dr. ${doctor.user.name} has been scheduled for ${new Date(req.body.date).toLocaleDateString()} at ${req.body.startTime}`
  });

  // Send SMS notification if phone number exists
  if (req.user.phone) {
    sendAppointmentSMS({
      to: req.user.phone,
      body: `Your appointment with Dr. ${doctor.user.name} has been scheduled for ${new Date(req.body.date).toLocaleDateString()} at ${req.body.startTime}`
    });
  }

  res.status(201).json({
    success: true,
    data: appointment
  });
});

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = asyncHandler(async (req, res, next) => {
  let appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return next(
      new ErrorResponse(`Appointment not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is appointment owner or doctor
  const doctor = await Doctor.findById(appointment.doctor);
  if (
    appointment.patient.toString() !== req.user.id &&
    doctor.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this appointment`,
        401
      )
    );
  }

  // If changing date/time, check availability
  if (req.body.date || req.body.startTime || req.body.endTime) {
    const isAvailable = await isSlotAvailable(
      appointment.doctor,
      req.body.date || appointment.date,
      req.body.startTime || appointment.startTime,
      req.body.endTime || appointment.endTime,
      appointment._id
    );

    if (!isAvailable) {
      return next(
        new ErrorResponse(`The selected time slot is not available`, 400)
      );
    }
  }

  appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // Create notification about update
  if (req.body.status) {
    let recipient = doctor.user;
    if (req.user.id === doctor.user.toString()) {
      recipient = appointment.patient;
    }

    await Notification.create({
      recipient,
      sender: req.user.id,
      type: 'appointment',
      title: 'Appointment Updated',
      message: `Your appointment status has been updated to ${req.body.status}`,
      relatedTo: {
        model: 'Appointment',
        id: appointment._id
      },
      deliveryMethod: 'all'
    });
  }

  res.status(200).json({
    success: true,
    data: appointment
  });
});

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.deleteAppointment = asyncHandler(async (req, res, next) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    return next(
      new ErrorResponse(`Appointment not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is appointment owner or admin
  if (
    appointment.patient.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this appointment`,
        401
      )
    );
  }

  // Check if it's at least 24 hours before the appointment
  const appointmentTime = new Date(appointment.date);
  const now = new Date();
  const diffHours = (appointmentTime - now) / (1000 * 60 * 60);

  if (diffHours < 24) {
    return next(
      new ErrorResponse(
        `Cannot cancel appointment with less than 24 hours notice`,
        400
      )
    );
  }

  await appointment.remove();

  // Notify doctor about cancellation
  const doctor = await Doctor.findById(appointment.doctor);
  await Notification.create({
    recipient: doctor.user,
    sender: req.user.id,
    type: 'appointment',
    title: 'Appointment Cancelled',
    message: `An appointment scheduled for ${new Date(appointment.date).toLocaleDateString()} at ${appointment.startTime} has been cancelled`,
    relatedTo: {
      model: 'Appointment',
      id: appointment._id
    },
    deliveryMethod: 'all'
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});