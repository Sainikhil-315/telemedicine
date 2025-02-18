const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');

// Utility to check if a time slot is available
exports.isSlotAvailable = async (doctorId, date, startTime, endTime, excludeAppointmentId = null) => {
  // Get day of week from date
  const dayOfWeek = new Date(date).toLocaleString('en-us', { weekday: 'long' });
  
  // Check if doctor has availability for this day
  const availability = await Availability.findOne({
    doctor: doctorId,
    day: dayOfWeek,
    isAvailable: true
  });

  if (!availability) {
    return false;
  }

  // Check if slot is within doctor's available slots
  const slot = availability.slots.find(slot => {
    return slot.startTime <= startTime && slot.endTime >= endTime && !slot.isBooked;
  });

  if (!slot) {
    return false;
  }

  // Check if there's an existing appointment for this slot
  const existingAppointment = await Appointment.findOne({
    doctor: doctorId,
    date: new Date(date).setHours(0, 0, 0, 0),
    $or: [
      // New appointment starts during an existing one
      {
        startTime: { $lte: startTime },
        endTime: { $gt: startTime }
      },
      // New appointment ends during an existing one
      {
        startTime: { $lt: endTime },
        endTime: { $gte: endTime }
      },
      // New appointment contains an existing one
      {
        startTime: { $gte: startTime },
        endTime: { $lte: endTime }
      }
    ],
    status: { $ne: 'cancelled' }
  });

  // If there's no existing appointment or the found one is the one we're updating, the slot is available
  if (!existingAppointment || (excludeAppointmentId && existingAppointment._id.toString() === excludeAppointmentId.toString())) {
    return true;
  }

  return false;
};

// Get available time slots for a doctor on a specific date
exports.getAvailableTimeSlots = async (doctorId, date) => {
  // Get day of week from date
  const dayOfWeek = new Date(date).toLocaleString('en-us', { weekday: 'long' });

  // Find doctor's availability for this day
  const availability = await Availability.findOne({
    doctor: doctorId,
    day: dayOfWeek,
    isAvailable: true
  });

  if (!availability) {
    return [];
  }

  // Get all appointments for the doctor on this date
  const appointments = await Appointment.find({
    doctor: doctorId,
    date: new Date(date).setHours(0, 0, 0, 0),
    status: { $ne: 'cancelled' }
  });

  // Filter out booked slots
  const availableSlots = availability.slots.filter(slot => {
    if (slot.isBooked) return false;

    // Check if there's any appointment during this slot
    const conflictingAppointment = appointments.find(appointment => {
      return (
        (appointment.startTime >= slot.startTime && appointment.startTime < slot.endTime) ||
        (appointment.endTime > slot.startTime && appointment.endTime <= slot.endTime) ||
        (appointment.startTime <= slot.startTime && appointment.endTime >= slot.endTime)
      );
    });

    return !conflictingAppointment;
  });

  return availableSlots;
};