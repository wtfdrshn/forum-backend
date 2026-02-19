import mongoose from 'mongoose';

const formResponseSchema = new mongoose.Schema({
    formId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Form',
        required: true
    },
    respondentInfo: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
        // Completely dynamic - can store any fields as an object
        // Examples: { name: "John", email: "john@example.com", phone: "123456", company: "ABC Corp" }
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
            type: mongoose.Schema.Types.Mixed, // Can be string, array, number, etc.
            required: true
        }
    }],
    submittedAt: {
        type: Date,
        default: Date.now
    },
    ipAddress: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['submitted', 'reviewed', 'archived'],
        default: 'submitted'
    },
    adminNotes: {
        type: String,
        default: ''
    },
    reviewedAt: {
        type: Date,
        default: null
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true
});

// Indexes for better query performance
formResponseSchema.index({ formId: 1, status: 1 });
formResponseSchema.index({ formId: 1, submittedAt: -1 });
// Note: Dynamic respondentInfo fields can't be indexed directly
// If needed, create specific indexes for common fields like email
formResponseSchema.index({ submittedAt: -1 });

const FormResponse = mongoose.model('FormResponse', formResponseSchema);

export default FormResponse;
