import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import {v2 as cloudinary} from 'cloudinary';

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

app.use(`/api/${config.apiVersion}/auth`, authRoute); // http://localhost:3000/api/v1/auth
app.use(`/api/${config.apiVersion}/member`, memberRoute); // http://localhost:3000/api/v1/member
app.use(`/api/${config.apiVersion}/gallery`, galleryRoute); // http://localhost:3000/api/v1/gallery
app.use(`/api/${config.apiVersion}/blog`, blogRoute); // http://localhost:3000/api/v1/blog
app.use(`/api/${config.apiVersion}/events`, eventRoute); // http://localhost:3000/api/v1/event
app.use(`/api/${config.apiVersion}/team`, teamRoute); // http://localhost:3000/api/v1/team

app.use(errorHandler);

app.listen(config.port, () => {
    connectDB();
    console.log(`Server is running on ${config.port}`);
});