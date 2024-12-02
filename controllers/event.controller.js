import Event from '../models/event.model.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Create a new event
const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            eventType,
            eventDate,
            buttonText,
            buttonLink
        } = req.body;

        // Validate required fields
        if (!title || !description || !eventType || !eventDate) {
          return res.status(400).json({
            success: false,
            message: "All required fields must be provided"
          });
        }

        // Check for cover image
        if (!req.files?.coverImage?.[0]) {
            return res.status(400).json({
                success: false,
                message: "Cover image is required"
            });
        }

        // Upload cover image
        const coverImagePath = req.files.coverImage[0].path;
        const coverImageResult = await cloudinary.uploader.upload(coverImagePath, {
          folder: 'events'
        });

        if (!coverImageResult?.url) {
            return res.status(500).json({
                success: false,
                message: "Cover image upload failed"
            });
        }

        // Handle additional images for previous events
        let images = [];
        if (eventType === 'previous' && req.files?.images) {
            const imageUploadPromises = req.files.images.map(image => 
                cloudinary.uploader.upload(image.path, {
                  folder: 'events'
                })
            );
            const imageResults = await Promise.all(imageUploadPromises);
            images = imageResults.map(result => result?.url).filter(url => url);
        }

        // Create event object
        const eventData = {
            title,
            description,
            eventType,
            eventDate,
            coverImage: coverImageResult.url,
            ...(eventType === 'upcoming' && { buttonText, buttonLink }),
            ...(images.length > 0 && { images })
        };

        const event = await Event.create(eventData);

        fs.unlink(coverImagePath, (err) => {
            if (err) {
                console.error('Failed to delete local file:', err);
            }
        });

        if (images.length > 0) {
            images.forEach(image => fs.unlink(image.path, (err) => {
                if (err) {
                    console.error('Failed to delete local file:', err);
                }
            }));
        }

        return res.status(201).json(event);

    } catch (error) {
        console.error("Error in createEvent:", error);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// Get all events
const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .sort({ eventDate: -1 }) // Sort by date in descending order
            .lean(); // Convert to plain JavaScript objects

        return res.status(200).json(events);

    } catch (error) {
        return res.status(500).json(error); 
    }
};

// Get single event by ID
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id).lean();

        if (!event) {
            throw new Error(404, "Event not found");
        }

        return res.status(200).json(event);

    } catch (error) {
        return res.status(500).json(error);
    }
};

// Update event
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            eventType,
            eventDate,
            buttonText,
            buttonLink
        } = req.body;

        const event = await Event.findById(id);
        if (!event) {
            throw new Error(404, "Event not found");
        }

        // Update basic fields
        if (title) event.title = title;
        if (description) event.description = description;
        if (eventDate) event.eventDate = eventDate;

        // Handle event type change
        if (eventType && eventType !== event.eventType) {
            if (!['upcoming', 'previous'].includes(eventType)) {
                throw new Error(400, "Invalid event type");
            }
            event.eventType = eventType;

            // Clear or require button fields based on new type
            if (eventType === 'upcoming') {
                if (!buttonText || !buttonLink) {
                    throw new Error(400, "Button text and link are required for upcoming events");
                }
                event.buttonText = buttonText;
                event.buttonLink = buttonLink;
                event.images = []; // Clear images if switching to upcoming
            } else {
                event.buttonText = undefined;
                event.buttonLink = undefined;
            }
        }

        // Handle cover image update
        if (req.files?.coverImage) {
            const coverImageResult = await cloudinary.uploader.upload(req.files.coverImage[0].path);
            if (!coverImageResult) {
                throw new Error(500, "Cover image upload failed");
            }
            event.coverImage = coverImageResult.url;
        }

        // Handle images update for previous events
        if (event.eventType === 'previous' && req.files?.images) {
            const uploadPromises = req.files.images.map(image => 
                cloudinary.uploader.upload(image.path)
            );
            const uploadResults = await Promise.all(uploadPromises);
            event.images = uploadResults.map(result => result.url);
        }

        await Event.findByIdAndUpdate(id, event);

        fs.unlink(req.files.coverImage[0].path, (err) => {
            if (err) {
                console.error('Failed to delete local file:', err);
            }
        });

        if (event.images.length > 0) {
            event.images.forEach(image => fs.unlink(image.path, (err) => {
                if (err) {
                    console.error('Failed to delete local file:', err);
                }
            }));
        }

        return res.status(200).json(event);

    } catch (error) {
       return res.status(500).json(error);
    }
};

// Delete event
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findByIdAndDelete(id);

        if (!event) {
            throw new Error(404, "Event not found");
        }

        // TODO: Delete images from Cloudinary
        const deletePromises = event.images.map(image => 
            cloudinary.uploader.destroy(image)
        );
        await Promise.all(deletePromises);

        return res.status(200).json({});

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export default {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
};

