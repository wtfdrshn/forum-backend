const config = {
    port: process.env.PORT || 3000,

    jwtSecret: process.env.JWT_SECRET || 'secret',

    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/forum',

    cloudName: process.env.CLOUD_NAME || '',

    apiKey: process.env.API_KEY || '',

    apiSecret: process.env.API_SECRET || '',

    apiVersion: 'v1' || '',
    clientUrl: process.env.CLIENT_URL || 'https://snsf.netlify.app',
    serverUrl: `${process.env.SERVER_URL}` || 'https://forum-backend-6zul.onrender.com',

    // devMode: process.env.DEV_MODE || true,
};
export default config;