import Blog from '../models/blog.model.js';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import mongoose from 'mongoose';

const getAllBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 5; // Number of blogs per page
        const blogs = await Blog.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(limit * (page - 1));
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getBlogBySlug = async (req, res) => {
    try {
        const post = await Blog.findOne({slug: req.params.slug});
        if (!post) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createBlog = async (req, res, next) => {
    try {
        const { title, content, summary } = req.body;

        let result;
        try {
            result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'blog',
            });
        } catch (uploadError) {
            console.error('Error uploading to Cloudinary:', uploadError);
            return res.status(500).json({ message: 'Error uploading image' });
        }

        const newPost = new Blog({
            title,
            summary,
            content,
            image: result.secure_url,
        });
        await newPost.save();
        res.status(201).json(newPost);

        fs.unlink(req.file.path, (err) => {
            if (err) {
                console.error('Failed to delete local file:', err);
            }
        });
    } catch (error) {
        console.error('Error creating blog post:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

const updateBlog = async (req, res) => {
    try {
        const { title, content, summary } = req.body;
        let updatedData = { title, summary, content };

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'blog',
            });
            updatedData.image = result.secure_url;
        }
        updatedData.updatedAt = Date.now();
        
        const updatedPost = await Blog.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.status(200).json(updatedPost);

        
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: 'Server Error' });
    }
};

const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        await Blog.findByIdAndDelete(req.params.id);
        await cloudinary.uploader.destroy(blog.image);
        res.status(200).json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// const getBlogById = async (req, res) => {
//     try {
//         const blogId = req.params.id;
//         if (!blogId) {
//             return res.status(400).json({ message: 'Blog ID is required' });
//         }

//         if (!mongoose.Types.ObjectId.isValid(blogId)) {
//             return res.status(400).json({ message: 'Invalid blog ID format' });
//         }

//         const blog = await Blog.findById(blogId);

//         if (!blog) {
//             return res.status(404).json({ message: 'Blog post not found' });
//         }
//         res.status(200).json(blog);
//     } catch (error) {
//         console.log(error);
        
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

export default { 
    // getBlogById, 
    getAllBlogs, 
    getBlogBySlug, 
    createBlog, 
    updateBlog, 
    deleteBlog 
};