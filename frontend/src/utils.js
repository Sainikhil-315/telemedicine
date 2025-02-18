import moment from 'moment';

// Format date to display format
export const formatDate = (date, format = 'MMMM DD, YYYY') => {
  return moment(date).format(format);
};

// Format time to display format
export const formatTime = (time, format = 'h:mm A') => {
  return moment(time, 'HH:mm').format(format);
};

// Format datetime
export const formatDateTime = (datetime, format = 'MMMM DD, YYYY h:mm A') => {
  return moment(datetime).format(format);
};

// Calculate time difference in minutes
export const getTimeDifference = (start, end) => {
  const startTime = moment(start);
  const endTime = moment(end);
  return endTime.diff(startTime, 'minutes');
};

// Check if a date is in the past
export const isPastDate = (date) => {
  return moment(date).isBefore(moment(), 'day');
};

// Check if a time slot is available
export const isTimeSlotAvailable = (slot, bookedSlots) => {
  return !bookedSlots.some(bookedSlot => 
    moment(slot).isSame(moment(bookedSlot), 'minute')
  );
};

// Generate time slots for a given day with interval
export const generateTimeSlots = (date, startTime, endTime, intervalMinutes = 30) => {
  const slots = [];
  const start = moment(date).set({
    hour: parseInt(startTime.split(':')[0]),
    minute: parseInt(startTime.split(':')[1]),
    second: 0
  });
  const end = moment(date).set({
    hour: parseInt(endTime.split(':')[0]),
    minute: parseInt(endTime.split(':')[1]),
    second: 0
  });

  while (start.isBefore(end)) {
    slots.push(start.format('YYYY-MM-DDTHH:mm:ss'));
    start.add(intervalMinutes, 'minutes');
  }

  return slots;
};

// Validate email format
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validate password strength
export const isStrongPassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '';
  const names = name.split(' ');
  return names.map(n => n.charAt(0).toUpperCase()).join('');
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(amount);
};