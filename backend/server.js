import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import subjectRoutes from './routes/subjects.js';
import questionRoutes from './routes/questions.js';
import aiRoutes from './routes/ai.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/ai', aiRoutes);

// Health check route (for uptime monitoring)
app.get('/api/health', async (req, res) => {
  const healthcheck = {
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  };
  
  try {
    // Check database connection
    const mongoose = await import('mongoose');
    healthcheck.database = mongoose.default.connection.readyState === 1 ? 'connected' : 'disconnected';
  } catch (e) {
    healthcheck.database = 'error';
  }
  
  res.status(200).json(healthcheck);
});

// Keep-alive self-ping (prevents Render cold starts)
const SELF_PING_INTERVAL = 14 * 60 * 1000; // 14 minutes (Render sleeps after 15 min)
const BACKEND_URL = process.env.BACKEND_URL;

if (BACKEND_URL && process.env.NODE_ENV === 'production') {
  setInterval(async () => {
    try {
      await fetch(`${BACKEND_URL}/api/health`);
      console.log('✓ Keep-alive ping successful');
    } catch (error) {
      console.log('Keep-alive ping failed:', error.message);
    }
  }, SELF_PING_INTERVAL);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
