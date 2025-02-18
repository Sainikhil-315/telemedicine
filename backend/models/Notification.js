const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    enum: ['appointment', 'reminder', 'system', 'chat'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedTo: {
    model: {
      type: String,
      enum: ['Appointment', 'Doctor', 'User']
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
    }
  },
  isRead: {
    type: Boolean,
    default: false
  },
  deliveryMethod: {
    type: String,
    enum: ['in-app', 'email', 'sms', 'all'],
    default: 'in-app'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries on recipient and isRead status
NotificationSchema.index({ recipient: 1, isRead: 1 });

module.exports = mongoose.model('Notification', NotificationSchema);