const Doctor = require('../models/Doctor');

const filterAppointments = async (req, res, next) => {
    if (req.user.role === 'doctor') {
        const doctor = await Doctor.findOne({ user: req.user._id });
        if (!doctor) {
            return next(new ErrorResponse(`No doctor profile found for this user`, 404));
        }
        req.query.doctor = doctor._id.toString();
    } else if (req.user.role === 'patient') {
        req.query.patient = req.user._id.toString();
    }
    next();
};
module.exports = filterAppointments;