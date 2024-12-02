import Team from "../models/team.model.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const getMembers = async (req, res) => {
    const members = await Team.find();
    res.status(200).json(members);
};

const addMember = async (req, res) => {
    try {
        const { name, email, linkedin, photo, role, designation } = req.body;
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "team",
        });

        const member = await Team.create({
            name,
            email,
            linkedin,
            photo: result.secure_url,
            role,
            designation,
        });

        await member.save();
        
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error('Failed to delete local file:', err);
            }
        });
        return res.status(201).json(member);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateMember = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if member exists
        const existingMember = await Team.findById(id);
        if (!existingMember) {
            return res.status(404).json({
                success: false,
                message: "Team member not found"
            });
        }

        // Create update object
        const updateData = {
            name: req.body.name,
            email: req.body.email,
            linkedin: req.body.linkedin,
            role: req.body.role,
            designation: req.body.designation
        };

        // Handle photo update if new photo is uploaded
        if (req.file) {
            // Upload new image to cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "team",
            });
            if (!result) {
                return res.status(400).json({
                    success: false,
                    message: "Error uploading new image"
                });
            }
            updateData.photo = result.url;

            // Delete old photo from cloudinary if exists
            if (existingMember.photo) {
                // Extract public_id from the URL
                const publicId = existingMember.photo.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }
        }

        // Update the member
        const updatedMember = await Team.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Team member updated successfully",
            data: updatedMember
        });

    } catch (error) {
        console.error('Update error:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error updating team member",
            error: error.message
        });
    }
};

const deleteMember = async (req, res) => {
    try {
        const { id } = req.params;
        await Team.findByIdAndDelete(id);
        res.status(200).json({ message: "Member deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    getMembers,
    addMember,
    updateMember,
    deleteMember,
};
