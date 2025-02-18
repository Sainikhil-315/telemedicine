const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialization: {
    type: String,
    required: [true, 'Please add your specialization']
  },
  experience: {
    type: Number,
    required: [true, 'Please add years of experience']
  },
  qualifications: [{
    degree: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    }
  }],
  consultationFee: {
    type: Number,
    required: [true, 'Please add your consultation fee']
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate average rating when adding a review
DoctorSchema.methods.calculateAverageRating = function() {
  let totalRating = 0;
  if (this.reviews.length === 0) {
    this.rating = 0;
    return;
  }
  
  this.reviews.forEach(review => {
    totalRating += review.rating;
  });
  
  this.rating = (totalRating / this.reviews.length).toFixed(1);
  this.reviewCount = this.reviews.length;
};

module.exports = mongoose.model('Doctor', DoctorSchema);