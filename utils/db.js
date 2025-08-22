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

    const connection = await mongoose.connect(uri);

    console.log('MongoDB connected successfully to', connection.connection.host);

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