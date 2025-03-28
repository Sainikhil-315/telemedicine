const Notification = require('../models/Notification');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all notifications for logged in user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = asyncHandler(async (req, res, next) => {
  // Extract query parameters
  const { status } = req.query;

  // Base query for the user's notifications
  const baseQuery = { recipient: req.user.id };

  // Modify query based on status
  let query = baseQuery;
  if (status === 'read') {
    query.isRead = true;
  } else if (status === 'unread') {
    query.isRead = false;
  }
  // If no status is provided, it will fetch all notifications

  // Fetch notifications
  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .populate({
      path: 'user',
      select: 'name'
    });

  // Count total notifications
  const totalCount = await Notification.countDocuments(baseQuery);
  
  // Count read notifications
  const readCount = await Notification.countDocuments({
    ...baseQuery,
    isRead: true
  });

  // Count unread notifications
  const unreadCount = await Notification.countDocuments({
    ...baseQuery,
    isRead: false
  });

  res.status(200).json({
    success: true,
    totalCount,
    readCount,
    unreadCount,
    count: notifications.length,
    data: notifications
  });
});

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread
// @access  Private
exports.getUnreadCount = asyncHandler(async (req, res, next) => {
  const count = await Notification.countDocuments({
    recipient: req.user.id,
    isRead: false
  });

  res.status(200).json({
    success: true,
    count
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id
// @access  Private
exports.markAsRead = asyncHandler(async (req, res, next) => {
  let notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(
      new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure notification belongs to user
  if (notification.recipient.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this notification`,
        401
      )
    );
  }

  notification = await Notification.findByIdAndUpdate(
    req.params.id,
    { isRead: true },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).json({
    success: true,
    data: notification
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications
// @access  Private
exports.markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.updateMany(
    { recipient: req.user.id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read'
  });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = asyncHandler(async (req, res, next) => {
  let notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(
      new ErrorResponse(`Notification not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure notification belongs to user
  if (notification.recipient.toString() !== req.user.id) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this notification`,
        401
      )
    );
  }

  await notification.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});