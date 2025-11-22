/**
 * Permission middleware to check if user has access to a specific page
 * @param {string} pageName - The page identifier (e.g., 'members', 'blog', 'recruitment')
 * @param {string} action - The action type ('view' or 'edit')
 */
const permissionMiddleware = (pageName, action = 'view') => {
    return async (req, res, next) => {
        try {
            // Super admins (isAdmin with no permissions or empty permissions object) have access to everything
            if (req.user.isAdmin && (!req.user.permissions || Object.keys(req.user.permissions).length === 0)) {
                return next();
            }

            // Check if user is admin
            if (!req.user.isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. Admin privileges required.'
                });
            }

            // Check permissions
            const permissions = req.user.permissions || {};
            const pagePermissions = permissions[pageName];

            if (!pagePermissions) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. You don't have permission to access ${pageName}.`
                });
            }

            // Check specific action permission
            if (action === 'edit' && !pagePermissions.edit) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. You don't have permission to edit ${pageName}.`
                });
            }

            if (action === 'view' && !pagePermissions.view) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. You don't have permission to view ${pageName}.`
                });
            }

            next();
        } catch (error) {
            console.error('Permission middleware error:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    };
};

export default permissionMiddleware;

