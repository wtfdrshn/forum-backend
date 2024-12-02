import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    linkedin: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["Post Holder", "Team Lead", "Member", "Faculty Advisor"],
    },
    designation: {
        type: String,
        required: true,
    },
});

const Team = mongoose.model("Team", teamSchema);

export default Team;
