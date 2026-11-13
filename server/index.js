require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const seedDatabase = require('./seedData');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB and Seed Data
connectDB().then(connected => {
  if (connected) {
    seedDatabase();
  }
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/clusters', require('./routes/clusters'));
app.use('/api/drones', require('./routes/drones'));
app.use('/api/batteries', require('./routes/batteries'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/off-season', require('./routes/offSeason'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/weather', require('./routes/weather'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'AgriDrone Hub Backend API',
    tagline: 'More Flights. Less Idle Time. Higher Farm Profitability.',
    timestamp: new Date()
  });
});

// Root API welcome
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to AgriDrone Hub API',
    tagline: 'More Flights. Less Idle Time. Higher Farm Profitability.',
    docs: '/api/health'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 AgriDrone Hub API Server running on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
});
