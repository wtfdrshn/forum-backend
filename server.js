import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './index.js';
import connectDB from './utils/db.js';
import config from './config/config.js';

dotenv.config();

const port = config.port || 5000;

async function startServer() {
	try {
		await connectDB();
		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	} catch (error) {
		console.error('Failed to start server:', error);
		process.exit(1);
	}
}

// Only start if not running in a serverless environment
if (!process.env.VERCEL) {
	startServer();
}

// Graceful shutdown
process.on('SIGINT', async () => {
	try {
		await mongoose.connection.close();
		process.exit(0);
	} catch (e) {
		process.exit(1);
	}
});
