import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    coverImage: {
        type: String,
        required: [true, 'Cover image is required'],
    },
    eventType: {
        type: String,
        enum: ["upcoming", "previous"],
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    buttonText: {
        type: String,
        required: false
    },
    buttonLink: {
        type: String,
        required: false
    },
    images: [{
        type: String,
        required: function() { return this.eventType === "previous"; }
    }]
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

export default Event;

