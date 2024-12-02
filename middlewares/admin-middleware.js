const adminMiddleware = async(req, res, next) => {
    try {
        const isAdmin = req.user.isAdmin;
        if(!isAdmin) return res.status(403).json({details: "Access denied!"});
        next();
    } catch (error) {
        next(error)
    }
}

export default adminMiddleware;