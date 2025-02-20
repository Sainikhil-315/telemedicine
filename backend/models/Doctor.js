const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  dayOfWeek: {
    type: Number,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  }
});

const doctorSchema = new mongoose.Schema({
 
  name: {
    type: String,
    required: true
  },
  password : {
    type: String,
    required: true
  },
  phone : {
    type: Number,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },
  specialty: {
    type: String,
    required: true
  },
  qualifications: {
    type: String,
    required: true
  },
  hospital: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  consultationFee: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  availableToday: {
    type: Boolean,
    default: true
  },
  availability: [availabilitySchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
