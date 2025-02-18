const { check } = require('express-validator');

exports.registerValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  check('phone', 'Please provide a valid phone number').matches(/^\+?[0-9]{10,15}$/)
];

exports.loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

exports.doctorProfileValidation = [
  check('specialization', 'Specialization is required').not().isEmpty(),
  check('experience', 'Experience must be a positive number').isInt({ min: 0 }),
  check('consultationFee', 'Consultation fee must be a positive number').isFloat({ min: 0 })
];

exports.appointmentValidation = [
  check('doctor', 'Doctor ID is required').isMongoId(),
  check('date', 'Valid date is required').isDate(),
  check('startTime', 'Start time is required').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  check('endTime', 'End time is required').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  check('type', 'Type must be either in-person, video or phone').isIn(['in-person', 'video', 'phone'])
];

exports.availabilityValidation = [
  check('day', 'Day must be a valid weekday').isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  check('slots', 'At least one time slot is required').isArray({ min: 1 }),
  check('slots.*.startTime', 'Start time is required and must be in HH:MM format').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  check('slots.*.endTime', 'End time is required and must be in HH:MM format').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
];