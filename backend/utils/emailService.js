const nodemailer = require('nodemailer');

// Create reusable transporter object using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Specify the service explicitly
  host: 'smtp.gmail.com', // Use Gmail's actual SMTP server
  port: 587,
  secure: false,
  auth: {
    user: 'bebjdjbbansnwbh@gmail.com',
    pass: 'wmxk xlni plff xpeh',
  },
  debug: true, // Enable debug logging
});


// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.log('Server connection error: ', error);
  } else {
    console.log('Server is ready to send messages');
  }
});

// Send appointment confirmation email
exports.sendAppointmentEmail = async (options) => {
  try {
    const message = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message
    };

    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email: ', error);
    throw error;
  }
};

// Send password reset email
exports.sendPasswordResetEmail = async (options) => {
  try {
    const message = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: 'Password Reset Token',
      text: `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${options.resetUrl}`
    };

    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending password reset email: ', error);
    throw error;
  }
};

// Send notification email
exports.sendNotificationEmail = async (options) => {
  try {
    const message = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      text: options.message
    };

    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending notification email: ', error);
    throw error;
  }
};