const config = {
    port: process.env.PORT || 3000,

    jwtSecret: process.env.JWT_SECRET,

    mongoURI: "mongodb+srv://Darshan:darshan88@cluster0.cdfgv43.mongodb.net/forum-backend",

    cloudName: process.env.CLOUD_NAME,

    apiKey: process.env.API_KEY,

    apiSecret: process.env.API_SECRET,

    apiVersion: 'v1',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5174',
    serverUrl: process.env.SERVER_URL || 'http://localhost:3000',

    resendApiKeys: process.env.RESEND_API

    // devMode: process.env.DEV_MODE || true,
};
export default config;