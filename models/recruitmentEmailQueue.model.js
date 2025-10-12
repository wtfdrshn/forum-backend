import mongoose from 'mongoose';

const recruitmentEmailQueueSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    html: {
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

export default mongoose.model('RecruitmentEmailQueue', recruitmentEmailQueueSchema);


