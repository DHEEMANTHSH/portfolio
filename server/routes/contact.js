const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  console.log('Incoming request to /api/contact:', req.body);
  
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('CRITICAL ERROR: EMAIL_USER or EMAIL_PASS environment variables are missing.');
      return res.status(500).json({ success: false, error: 'Server configuration error: Email credentials missing.' });
    }

    // Explicit SMTP configuration with connection timeout prevention
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      connectionTimeout: 15000, // 15 seconds timeout buffer
      socketTimeout: 15000
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Portfolio Contact from ${name}`,
      text: `You have received a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`
    };

    console.log('Attempting to send email via secure SMTP...');
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');

    return res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to send email. Please check server logs.' });
  }
});

module.exports = router;