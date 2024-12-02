import Image from '../models/gallery.model.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const getImages = async (req, res, next) => {
    try {
        const images = await Image.find();
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: 'Could not fetch the images' });
    }
};

const uploadImage = async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'gallery',
        });

        // Save image message to the database
        const newImage = new Image({
            url: result.secure_url,
            publicId: result.public_id,
        });

        await newImage.save();
        res.status(201).json(newImage);

        // Delete the local file after the response is sent
        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error('Failed to delete local file:', err);
            }
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

const deleteImage = async (req, res, next) => {
    const { id } = req.params;

    try {
        const image = await Image.findById(id);
        if (!image) {
            return res.status(404).json({ message: 'Image not found' });
        }
        // Delete image from Cloudinary
        await cloudinary.uploader.destroy(image.publicId);

        // Delete image from the database
        await image.deleteOne();

        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        // next(error);
        res.status(500).json({ message: 'Delete failed' });
    }
};

export default {
    getImages,
    uploadImage,
    deleteImage,
}