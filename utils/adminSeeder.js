const User = require('../models/user.model.js');

const adminSeeder = async () => {
    try {
        const admin = await User.findOne({ isAdmin: true });
        if (!admin) {
            const user = new User({
                first_name: 'Admin',
                last_name: 'User',
                email: `${process.env.ADMIN_EMAIL}`,
                password: `${process.env.ADMIN_PASSWORD}`,
                isAdmin: true,
            });
            await user.save();
            console.log('Admin user created');
        }
    } catch (error) {
        console.error(`Error while creating admin`, error);
    }
};