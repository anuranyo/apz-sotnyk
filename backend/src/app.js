const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const readingRoutes = require('./routes/readingRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Новая строка

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://apz-sotnyk.vercel.app',
      'http://apz-sotnyk.vercel.app',
      'https://apz-sotnyk-serv.vercel.app',
      'http://apz-sotnyk-serv.vercel.app',
      'http://localhost:5000',
      'http://localhost:5174',
      'http://localhost:3000'
    ];
    
    console.log('Request origin:', origin);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/readings', readingRoutes);
app.use('/api/admin', adminRoutes); // Новая строка

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Weight Monitor API',
    version: '1.0.0',
    status: 'online'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Server error', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred' 
  });
});

module.exports = app;