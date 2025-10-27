import mongoose from 'mongoose';

const recruitmentApplicationSchema = new mongoose.Schema({
    recruitmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recruitment',
        required: true
    },
    applicantInfo: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        phone: {
            type: String,
            trim: true
        },
        college: {
            type: String,
            trim: true
        },
        course: {
            type: String,
            trim: true
        },
        year: {
            type: String,
            trim: true
        },
        prn: {
            type: String,
            trim: true
        },
        gender: {
            type: String,
            trim: true
        }
    },
    answers: [{
        questionIndex: {
            type: Number,
            required: true
        },
        question: {
            type: String,
            required: true
        },
        answer: {
            type: mongoose.Schema.Types.Mixed, // Can be string, array, etc.
            required: true
        }
    }],
    status: {
        type: String,
        enum: ['submitted', 'under-review', 'shortlisted', 'rejected', 'selected'],
        default: 'submitted'
    },
    adminNotes: {
        type: String,
        default: ''
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    reviewedAt: Date,
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Index for better query performance
recruitmentApplicationSchema.index({ recruitmentId: 1, status: 1 });
recruitmentApplicationSchema.index({ 'applicantInfo.email': 1 });

const RecruitmentApplication = mongoose.model('RecruitmentApplication', recruitmentApplicationSchema);

export default RecruitmentApplication;
