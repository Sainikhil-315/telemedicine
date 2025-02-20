const twilio = require('twilio');

// Create twilio client
const client = twilio(
  'AC39fc5688163cd10b9bc0553a1983d13a',
  'c4d4c0ac6f9ca8cb032c497a2899fe2c'
);

// Send appointment confirmation SMS
const isValidPhoneNumber = (phone) => /^\+\d{10,15}$/.test(phone);

exports.sendAppointmentSMS = async (options) => {
  if (!isValidPhoneNumber(options.to)) {
    console.error("Error: Invalid phone number format:", options.to);
    return;
  }

  try {
    console.log(options)
    await client.messages.create({
      body: options.body,
      from: '+18314801225',
      to: options.to
    });
    console.log("Message sent successfully to:", options.to);
  } catch (error) {
    console.error("Twilio SMS Error:", error.message);
  }
};


// Send reminder SMS
exports.sendReminderSMS = async (options) => {
  await client.messages.create({
    body: options.body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: options.to
  });
};