import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import crypto from 'crypto';
import config from '../config/config.js';

const resend = new Resend(process.env.RESEND_API_KEY || "re_LxXEA3aq_Hm4RHQpn26b7Js6xBBqbkKJb");

// Get all admins
const getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find({ isAdmin: true })
            .select({ password: 0 })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: admins
        });
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Generate random password
const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
};

// Send admin credentials email
const sendAdminCredentialsEmail = async (email, firstName, lastName, password) => {
    try {
        const loginUrl = `${config.clientUrl}/admin/login` || 'http://localhost:5173/admin/login' ;
        
        await resend.emails.send({
            from: "MIT-WPU Science & Spirituality Forum <admin@snsf.live>",
            to: email,
            replyTo: 'snsf@mitwpu.edu.in',
            subject: 'Admin Account Created - MIT-WPU Science & Spirituality Forum',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Admin Account Created</h2>
                    <p>Dear ${firstName} ${lastName},</p>
                    <p>Your admin account has been created for the MIT-WPU Science & Spirituality Forum admin panel.</p>
                    <p><strong>Your login credentials:</strong></p>
                    <ul style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
                        <li><strong>Email:</strong> ${email}</li>
                        <li><strong>Password:</strong> ${password}</li>
                    </ul>
                    <p style="color: #d32f2f; font-weight: bold;">⚠️ Please change your password after your first login for security.</p>
                    <p>You can access the admin panel at:</p>
                    <p><a href="${loginUrl}" style="background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Login to Admin Panel</a></p>
                    <p>Best regards,<br/>MIT-WPU Science & Spirituality Forum Team</p>
                </div>
            `
        });
        console.log(`Admin credentials email sent to ${email}`);
    } catch (error) {
        console.error('Error sending admin credentials email:', error);
        // Don't throw error - admin creation should still succeed even if email fails
    }
};

// Create a new admin
const createAdmin = async (req, res) => {
    try {
        const { first_name, last_name, email, password, permissions, sendEmail } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Use provided password or generate one
        const adminPassword = password || generatePassword();

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

        // Only store view permissions (remove edit permissions if any)
        const viewOnlyPermissions = {};
        if (permissions) {
            Object.keys(permissions).forEach(pageName => {
                if (permissions[pageName]?.view) {
                    viewOnlyPermissions[pageName] = { view: true };
                }
            });
        }

        // Create admin user
        const admin = new User({
            first_name,
            last_name,
            email,
            password: hashedPassword,
            isAdmin: true,
            permissions: Object.keys(viewOnlyPermissions).length > 0 ? viewOnlyPermissions : {}
        });

        await admin.save();

        // Send email with credentials if requested
        if (sendEmail !== false) {
            await sendAdminCredentialsEmail(email, first_name, last_name, adminPassword);
        }

        // Return admin without password, but include generated password if it was generated
        const adminData = admin.toObject();
        delete adminData.password;
        
        const response = {
            success: true,
            message: 'Admin created successfully',
            data: adminData
        };

        // Include password in response if it was generated (for display purposes)
        if (!password) {
            response.generatedPassword = adminPassword;
        }

        res.status(201).json(response);
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update admin permissions (only view permissions now)
const updateAdminPermissions = async (req, res) => {
    try {
        const { adminId } = req.params;
        const { permissions } = req.body;

        const admin = await User.findById(adminId);
        if (!admin || !admin.isAdmin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        // Only store view permissions (remove edit permissions if any)
        const viewOnlyPermissions = {};
        if (permissions) {
            Object.keys(permissions).forEach(pageName => {
                if (permissions[pageName]?.view) {
                    viewOnlyPermissions[pageName] = { view: true };
                }
            });
        }

        admin.permissions = Object.keys(viewOnlyPermissions).length > 0 ? viewOnlyPermissions : {};
        await admin.save();

        const adminData = admin.toObject();
        delete adminData.password;

        res.status(200).json({
            success: true,
            message: 'Admin permissions updated successfully',
            data: adminData
        });
    } catch (error) {
        console.error('Error updating admin permissions:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Update admin password (for super admins to change other admins' passwords)
const updateAdminPassword = async (req, res) => {
    try {
        const { adminId } = req.params;
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        const admin = await User.findById(adminId);
        if (!admin || !admin.isAdmin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        // Hash new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        admin.password = hashedPassword;
        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Error updating admin password:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Change own password (for any admin to change their own password)
const changeOwnPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.userId;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password and new password are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters long'
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Delete admin
const deleteAdmin = async (req, res) => {
    try {
        const { adminId } = req.params;

        // Prevent deleting yourself
        if (adminId === req.userId.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account'
            });
        }

        const admin = await User.findById(adminId);
        if (!admin || !admin.isAdmin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        await User.findByIdAndDelete(adminId);

        res.status(200).json({
            success: true,
            message: 'Admin deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get available pages for permissions
const getAvailablePages = async (req, res) => {
    try {
        const pages = [
            { id: 'members', name: 'Members', description: 'Manage forum members' },
            { id: 'gallery', name: 'Gallery', description: 'Manage image gallery' },
            { id: 'blog', name: 'Blogs', description: 'Manage blog posts' },
            { id: 'team', name: 'Teams', description: 'Manage team members' },
            { id: 'events', name: 'Events', description: 'Manage events' },
            { id: 'recruitment', name: 'Recruitment', description: 'Manage recruitment forms and applications' },
            { id: 'admins', name: 'Admin Management', description: 'Manage admin users and permissions' }
        ];

        res.status(200).json({
            success: true,
            data: pages
        });
    } catch (error) {
        console.error('Error fetching available pages:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export default {
    getAllAdmins,
    createAdmin,
    updateAdminPermissions,
    updateAdminPassword,
    changeOwnPassword,
    deleteAdmin,
    getAvailablePages
};

