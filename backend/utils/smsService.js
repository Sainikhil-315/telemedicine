const twilio = require('twilio');

// Create twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send appointment confirmation SMS
exports.sendAppointmentSMS = async (options) => {
  await client.messages.create({
    body: options.body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: options.to
  });
};

// Send reminder SMS
exports.sendReminderSMS = async (options) => {
  await client.messages.create({
    body: options.body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: options.to
  });
};