const express = require('express');
const router = express.Router();

// Import route files
const auth = require('./api/auth');
const users = require('./api/users');
const doctors = require('./api/doctors');
const appointments = require('./api/appointments');
const notifications = require('./api/notifications');

// Mount routers
router.use('/api/auth', auth);
router.use('/api/users', users);
router.use('/api/doctors', doctors);
router.use('/api/appointments', appointments);
router.use('/api/notifications', notifications);

module.exports = router;