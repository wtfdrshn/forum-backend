import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.String,
        ref: 'Member',
        required: true,
    },
    member_id: {
        type: mongoose.Schema.Types.String,
        ref: 'Member',
        required: true
    },
    token: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
});

const Badge = mongoose.model('Badge', badgeSchema);

export default Badge;