import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    url: String, //secure_url
    publicId: String, //public_id
    name: String, //display_name
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Image', imageSchema);