import mongoose from 'mongoose';

const emailQueueSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    memId: {
        type: String,
        required: true
    },
    attempts: {
        type: Number,
        default: 0
    },
    nextAttempt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('EmailQueue', emailQueueSchema); 