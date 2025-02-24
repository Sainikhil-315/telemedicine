const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  getDataWithToken,
  checkAuthStatus
} = require('../../controllers/authController');
const { setCacheHeaders, protect } = require('../../middleware/auth');

const router = express.Router();
router.get('/status', setCacheHeaders, checkAuthStatus);
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;