import mongoose from 'mongoose';
import config from '../config/config.js';
import User from '../models/user.model.js';

const connectDB = async () => {
  
  try {

    const uri = config.mongoURI || process.env.MONGO_URI;

    const connection = await mongoose.connect(uri);

    // console.log(connection);

    console.log('MongoDB connected successfully to', connection.connection.host);

    const admin = await User.findOne({ isAdmin: true });

    if (admin) {
      console.log('Admin user already exists');
      return;
    }
    
    if (!admin) {
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
  } catch (error) {
    console.error('Error connecting mongodb', error);
    process.exit(1);
  }
}

export default connectDB;