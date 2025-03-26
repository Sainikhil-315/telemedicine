const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const JWT_SECRET = 'nikhil';

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
  username:{
    type: String,
    required: [true, "please enter a username"],
    unique: true
  },
  phone : {
    type: String,
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
    default: 4,
    type: Number,
    default: 0
  },
  reviewCount: {
    default: 55, 
    type: Number,
    default: 0
  },
  availableToday: {
    type: Boolean,
    default: true
  },
  availability: {
    type: [availabilitySchema],
    default:  [
    {
      "dayOfWeek": 1,
      "startTime": "09:00",
      "endTime": "16:00"
    },
    {
      "dayOfWeek": 2,
      "startTime": "09:00",
      "endTime": "16:00"
    },
    {
      "dayOfWeek": 3,
      "startTime": "09:00",
      "endTime": "16:00"
    },
    {
      "dayOfWeek": 4,
      "startTime": "09:00",
      "endTime": "16:00"
    },
    {
      "dayOfWeek": 5,
      "startTime": "09:00",
      "endTime": "16:00"
    },
    {
      "dayOfWeek": 6,
      "startTime": "09:00",
      "endTime": "16:00"
    }
  ]}
}, {
  timestamps: true
});

// Hash password before saving
doctorSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
doctorSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
doctorSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, 'nikhil');
};

module.exports = mongoose.model('Doctor', doctorSchema);
