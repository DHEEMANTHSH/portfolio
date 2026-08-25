// server/db.js
const mongoose = require('mongoose');

// Ensure MONGODB_URI exists in your environment variables
const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
  console.error('❌ FATAL ERROR: MONGODB_URI is not defined in .env file.');
  process.exit(1); // Stop the server if the URI is missing
}

mongoose.connect(dbURI)
  .then(() => {
    console.log('================================================');
    console.log('✅ MongoDB Connection Established Successfully!');
    console.log('================================================');
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:');
    console.error('   Ensure your IP is whitelisted in MongoDB Atlas and password is correct.');
    console.error('   Full Error:', err.message);
    process.exit(1); // Stop the server if connection fails
  });

// Optional: Monitor connection status events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

module.exports = mongoose;