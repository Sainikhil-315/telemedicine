const express = require('express');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../../controllers/notificationController');

const router = express.Router();

const { protect } = require('../../middleware/auth');

router.use(protect);

router
  .route('/')
  .get(getNotifications)
  .put(markAllAsRead);

router.get('/unread', getUnreadCount);

router
  .route('/:id')
  .put(markAsRead)
  .delete(deleteNotification);

module.exports = router;