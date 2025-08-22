import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import {v2 as cloudinary} from 'cloudinary';
import mongoose from 'mongoose';

import connectDB from './utils/db.js';

import config from './config/config.js';

import errorHandler from './middlewares/error-middleware.js';

// Import models to register schemas
import './models/user.model.js';
import './models/gallery.model.js';
import './models/blog.model.js';
import './models/event.model.js';
import './models/member.model.js';
import './models/team.model.js';
import './models/badge.model.js';
import './models/emailQueue.model.js';

import authRoute from './routes/auth.routes.js';
import memberRoute from './routes/member.routes.js';
import galleryRoute from './routes/gallery.routes.js';
import blogRoute from './routes/blog.routes.js';
import eventRoute from './routes/event.routes.js';
import teamRoute from './routes/team.routes.js';
dotenv.config();

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'https://snsf.live', 'https://forum.snsf.live', 'https://www.snsf.live'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

app.use(express.json());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('Welcome to the SNSF API');
});

app.get('/health', async (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  // Try to connect if not connected
  if (dbStatus === 'disconnected') {
    try {
      await connectDB();
    } catch (error) {
      console.error('Health check: Database connection failed:', error);
    }
  }
  
  const finalDbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    database: finalDbStatus,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Test database connection endpoint
app.get('/test-db', async (req, res) => {
  try {
    await connectDB();
    res.status(200).json({ 
      message: 'Database connection successful',
      status: 'connected'
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Database connection failed',
      error: error.message
    });
  }
});

app.use(`/api/${config.apiVersion}/auth`, authRoute); // http://localhost:3000/api/v1/auth
app.use(`/api/${config.apiVersion}/member`, memberRoute); // http://localhost:3000/api/v1/member
app.use(`/api/${config.apiVersion}/gallery`, galleryRoute); // http://localhost:3000/api/v1/gallery
app.use(`/api/${config.apiVersion}/blog`, blogRoute); // http://localhost:3000/api/v1/blog
app.use(`/api/${config.apiVersion}/events`, eventRoute); // http://localhost:3000/api/v1/event
app.use(`/api/${config.apiVersion}/team`, teamRoute); // http://localhost:3000/api/v1/team

app.use(errorHandler);

// For Vercel deployment, we need to export the app
// and handle database connection differently

// For local development
if (process.env.NODE_ENV !== 'production') {
    app.listen(config.port, () => {
        console.log(`Server is running on ${config.port}`);
        // Connect to database for local development
        connectDB().catch(err => {
            console.error('Database connection failed:', err);
        });
    });
}

// Export for Vercel
export default app;