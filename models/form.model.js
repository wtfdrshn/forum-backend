import mongoose from 'mongoose';
import slugify from 'slugify';

const formSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    headerImage: {
        type: String,
        default: null
    },
    customRoute: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        // Ensure route is URL-safe
        validate: {
            validator: function(v) {
                return /^[a-z0-9-]+$/.test(v);
            },
            message: 'Custom route must contain only lowercase letters, numbers, and hyphens'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    customQuestions: [{
        question: {
            type: String,
            required: true
        },
        type: {
            type: String,
            enum: ['text', 'textarea', 'dropdown', 'radio', 'checkbox', 'email', 'number', 'date'],
            required: true
        },
        options: [String], // For dropdown, radio, checkbox
        required: {
            type: Boolean,
            default: false
        },
        placeholder: String,
        validation: {
            minLength: Number,
            maxLength: Number,
            pattern: String
        },
        // Optional conditional visibility: show this question if another question matches a value
        showIf: {
            questionIndex: { type: Number },
            operator: { type: String, enum: ['equals'], default: 'equals' },
            value: { type: String }
        }
    }],
    successMessage: {
        type: String,
        default: 'Thank you for your submission!'
    },
    closedMessage: {
        type: String,
        default: 'This form is currently closed. Please check back later.'
    },
    allowMultipleSubmissions: {
        type: Boolean,
        default: false
    },
    maxSubmissions: {
        type: Number,
        default: null // null means unlimited
    },
    currentSubmissions: {
        type: Number,
        default: 0
    },
    submissionDeadline: {
        type: Date,
        default: null
    },
    collectEmail: {
        type: Boolean,
        default: true
    },
    collectName: {
        type: Boolean,
        default: true
    },
    // Define what respondent fields to collect (dynamic)
    respondentFields: [{
        fieldName: {
            type: String,
            required: true,
            trim: true
        },
        label: {
            type: String,
            required: true,
            trim: true
        },
        type: {
            type: String,
            enum: ['text', 'email', 'number', 'tel', 'url', 'date'],
            default: 'text'
        },
        required: {
            type: Boolean,
            default: false
        },
        placeholder: String,
        validation: {
            minLength: Number,
            maxLength: Number,
            pattern: String
        }
    }],
    settings: {
        type: Object,
        default: {}
        // Can store additional settings like:
        // - redirectUrl: URL to redirect after submission
        // - notificationEmail: Email to notify on submission
        // - theme: Form theme/styling
    }
}, {
    timestamps: true
});

// Pre-save hook to ensure customRoute is slugified
formSchema.pre('save', function(next) {
    if (this.isModified('customRoute') && this.customRoute) {
        this.customRoute = slugify(this.customRoute, { lower: true, strict: true });
    }
    next();
});

// Index for faster lookups
formSchema.index({ customRoute: 1 });
formSchema.index({ isActive: 1 });

const Form = mongoose.model('Form', formSchema);

export default Form;
