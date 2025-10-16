import mongoose from 'mongoose';
import config from '../config/config.js';
import User from '../models/user.model.js';

const connectDB = async () => {
  
  try {

    const uri = config.mongoURI || process.env.MONGO_URI;

    if (!uri) {
      console.error('MongoDB URI is not configured. Please set MONGO_URI environment variable.');
      return false;
    }

    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected');
      return true;
    }

    // Set connection options to handle timeouts
    const options = {
      serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // Disable mongoose buffering
    };

    const connection = await mongoose.connect(uri, options);

    console.log('MongoDB connected successfully to', connection.connection.host);

    // Initialize email queue services after database connection
    try {
      const { emailQueueService } = await import('../queues/emailQueue.js');
      const { recruitmentEmailQueueService } = await import('../queues/recruitmentEmailQueue.js');
      console.log('Email queue services initialized');
    } catch (queueError) {
      console.error('Error initializing email queue services:', queueError);
    }

    // Only create admin user if not in production or if explicitly needed
    if (process.env.NODE_ENV !== 'development') {
      const admin = await User.findOne({ isAdmin: true });

      if (admin) {
        console.log('Admin user already exists');
      } else {
        const user = new User({
          first_name: 'Website',
          last_name: 'Admin',
          email: config.adminEmail,
          password: config.adminPassword,
          isAdmin: true,
        });
        await user.save();
        console.log('Admin user created');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error connecting mongodb', error);
    return false;
  }
}

export default connectDB;