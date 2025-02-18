const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { 
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
  // Optional fields
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
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);