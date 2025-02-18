const express = require('express');
const {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment
} = require('../../controllers/appointmentController');

const Appointment = require('../../models/Appointment');

const router = express.Router();

const { protect, authorize } = require('../../middleware/auth');
const advancedResults = require('../../middleware/advancedResults');

router
  .route('/')
  .get(
    protect,
    advancedResults(Appointment, [
      {
        path: 'patient',
        select: 'name email phone'
      },
      {
        path: 'doctor',
        select: 'specialization consultationFee',
        populate: {
          path: 'user',
          select: 'name email'
        }
      }
    ]),
    getAppointments
  )
  .post(protect, authorize('patient'), createAppointment);

router
  .route('/:id')
  .get(protect, getAppointment)
  .put(protect, updateAppointment)
  .delete(protect, deleteAppointment);

module.exports = router;