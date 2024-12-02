import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const authMiddleware = async(req, res, next) => {
    const token = req.header("Authorization");
    
    // console.log("Token middleware: ", token);
    if(!token) {
        return res.status(401).json({ message: "Unauthorized - Token Not provided!" })
    }

    const jwtToken = token.replace("Bearer ", "").trim();
    const jwtSecret = process.env.JWT_SECRET;

    try {
        const isVerified = jwt.verify(jwtToken, jwtSecret);
        // console.log(isVerified);

        const userData = await User.findOne({ email: isVerified.email }).select({ password: 0 });

        req.user = userData;
        req.token = jwtToken;
        req.userId = userData._id;

        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.log("Unauthorized! Token expired!");
        }
        console.error(error);
        return res.status(401).json({ message: "Unauthorized! Invalid Token provided!" })
    }
}

export default authMiddleware;