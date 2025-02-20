const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

async function isSlotAvailable(doctorId, date, startTime, endTime, appointmentId = null) {
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    throw new Error('Doctor not found');
  }

  const dayOfWeek = new Date(date).getDay();
  const doctorAvailability = doctor.availability.find(avail => avail.dayOfWeek === dayOfWeek);
  console.log("Doc avail : ",doctorAvailability)
  if (!doctorAvailability) {
    return false;
  }

  const { startTime: availStartTime, endTime: availEndTime } = doctorAvailability;
  if (startTime < availStartTime || endTime > availEndTime) {
    return false;
  }

  const existingAppointments = await Appointment.find({
    doctor: doctorId,
    date,
    _id: { $ne: appointmentId },
    $or: [
      { startTime: { $lte: startTime }, endTime: { $gte: startTime } },
      { startTime: { $lte: endTime }, endTime: { $gte: endTime } }
    ]
  });

  return existingAppointments.length === 0;
}

module.exports = { isSlotAvailable };
