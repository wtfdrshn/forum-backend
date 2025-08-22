import mongoose from 'mongoose';
import connectDB from '../utils/db.js';

const dbCheckMiddleware = async (req, res, next) => {
    try {
        // Check if already connected
        if (mongoose.connection.readyState !== 1) {
            // Try to connect
            const connected = await connectDB();
            if (!connected) {
                return res.status(503).json({
                    message: 'Database connection not available',
                    status: 'Service Unavailable'
                });
            }
        }
        next();
    } catch (error) {
        console.error('Database check middleware error:', error);
        return res.status(503).json({
            message: 'Database connection error',
            status: 'Service Unavailable'
        });
    }
};

export default dbCheckMiddleware;
