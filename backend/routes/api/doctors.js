const express = require('express');
const {
  getDoctors,
  getDoctor,
  createDoctor,
  updateDoctor,
  deleteDoctor,
  addAvailability,
  getAvailabilities
} = require('../../controllers/doctorController');

const Doctor = require('../../models/Doctor');

const router = express.Router();

const { protect, authorize } = require('../../middleware/auth');
const advancedResults = require('../../middleware/advancedResults');
router.get('/', getDoctors);
router
  .route('/')
  .get(
    advancedResults(Doctor, {
      path: 'user',
      select: 'name email'
    }),
    getDoctors
  )
  .post(protect, authorize('doctor'), createDoctor);

router
  .route('/:id')
  .get(getDoctor)
  .put(protect, authorize('doctor', 'admin'), updateDoctor)
  .delete(protect, authorize('doctor', 'admin'), deleteDoctor);

router
  .route('/:id/availability')
  .get(getAvailabilities)
  .post(protect, authorize('doctor', 'admin'), addAvailability);

module.exports = router;