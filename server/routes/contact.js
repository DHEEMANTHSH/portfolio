const express = require('express');
const router = express.Router();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

router.post('/', async (req, res) => {
  console.log('Incoming request to /api/contact:', req.body);
  
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    if (!process.env.RESEND_API_KEY || !process.env.EMAIL_USER) {
      console.error('CRITICAL ERROR: RESEND_API_KEY or EMAIL_USER environment variables are missing.');
      return res.status(500).json({ success: false, error: 'Server configuration error: API keys missing.' });
    }

    console.log('Attempting to send email via Resend API (HTTPS)...');
    
    const data = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: process.env.EMAIL_USER, // Your destination inbox
      subject: `New Portfolio Contact from ${name}`,
      text: `You have received a new message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`
    });

    console.log('Email sent successfully via Resend:', data);
    return res.status(200).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to send email.' });
  }
});

module.exports = router;