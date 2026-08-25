// Load environment variables from the .env file located one folder up
require('dotenv').config({ path: '../.env' });

const express = require('express');
const cors = require('cors');
const path = require('path');

// Import your API route handlers
const aiRoutes = require('./routes/ai');
const contactRoutes = require('./routes/contact');

const app = express();

// Use PORT from environment variables (for Render/Railway) or default to 5000 (for local)
const PORT = process.env.PORT || 5000;

// Middleware configuration
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// ==========================================
// Application Routing & Static Content
// ==========================================

// 1. Serve static frontend files from the 'client' directory.
// This automatically serves your index.html when visiting the base URL.
app.use(express.static(path.join(__dirname, '../client')));

// 2. Define API Routes
app.use('/api/ai', aiRoutes);
app.use('/api/contact', contactRoutes);

// ==========================================
// Start the Server
// ==========================================
app.listen(PORT, () => {
  console.log(`================================================`);
  console.log(`✅ Server successfully started.`);
  console.log(`🌍 Listening on port: ${PORT}`);
  console.log(`🔗 Local Access: http://localhost:${PORT}`);
  console.log(`================================================`);
});