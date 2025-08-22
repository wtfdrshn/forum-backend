import mongoose from 'mongoose';

const dbCheckMiddleware = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            message: 'Database connection not available',
            status: 'Service Unavailable'
        });
    }
    next();
};

export default dbCheckMiddleware;
