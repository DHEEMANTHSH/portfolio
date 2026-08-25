require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Global safety check for routes
try {
  const aiRoutes = require('./routes/ai');
  const contactRoutes = require('./routes/contact');
  app.use('/api/ai', aiRoutes);
  app.use('/api/contact', contactRoutes);
} catch (err) {
  console.error('CRITICAL: Failed to load routes:', err);
}

// Static frontend serving
app.use(express.static(path.join(__dirname, '../client')));

// Global unhandled exception catcher to stop "Application exited early" crashes
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`================================================`);
  console.log(`✅ Server successfully started on port ${PORT}`);
  console.log(`================================================`);
});