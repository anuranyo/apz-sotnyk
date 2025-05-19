const app = require('./app');
const connectDB = require('./config/db');
const { connectMqtt } = require('./config/mqtt');
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Connect to MQTT broker
connectMqtt();

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});