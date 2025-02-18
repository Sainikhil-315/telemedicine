const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  slots: [{
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    isBooked: {
      type: Boolean,
      default: false
    }
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  specialHolidays: [{
    date: {
      type: Date
    },
    reason: {
      type: String
    }
  }]
});

// Index for faster queries on doctor and day
AvailabilitySchema.index({ doctor: 1, day: 1 });

module.exports = mongoose.model('Availability', AvailabilitySchema);