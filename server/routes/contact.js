const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  console.log('Incoming request to /api/contact:', req.body);
  
  try {
    const { name, email, message } = req.body;

    // Validate incoming fields
    if (!name || !email || !message) {
      console.log('Validation failed: Missing fields');
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    // Ensure environment variables are loaded
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('CRITICAL ERROR: EMAIL_USER or EMAIL_PASS environment variables are missing on Render.');
      return res.status(500).json({ success: false, error: 'Server configuration error: Email credentials missing.' });
    }

    // Configure Nodemailer transporter using environment variables from Render
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email options configuration
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Sends the message to your own inbox
      subject: `New Portfolio Contact from ${name}`,
      text: `You have received a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`
    };

    // Send the email
    console.log('Attempting to send email via Nodemailer...');
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');

    return res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to send email. Please check server logs.' });
  }
});

module.exports = router;