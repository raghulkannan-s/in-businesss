"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSportsHallAccess = exports.requireManagementLevel = exports.requireAdminOrManager = exports.requireAdminOrOwner = exports.requireManager = exports.requireOwner = exports.requireAdmin = exports.requireRole = void 0;
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                res.status(401).json({
                    message: 'Authentication required'
                });
                return;
            }
            const userRole = req.user.role;
            if (!allowedRoles.includes(userRole)) {
                res.status(403).json({
                    message: 'Insufficient permissions. Required roles: ' + allowedRoles.join(', '),
                    userRole,
                    allowedRoles
                });
                return;
            }
            next();
        }
        catch (error) {
            console.error('Role authorization error:', error);
            return res.status(500).json({
                message: 'Authorization error'
            });
        }
    };
};
exports.requireRole = requireRole;
// Predefined role combinations
exports.requireAdmin = (0, exports.requireRole)(['ADMIN']);
exports.requireOwner = (0, exports.requireRole)(['OWNER']);
exports.requireManager = (0, exports.requireRole)(['MANAGER']);
exports.requireAdminOrOwner = (0, exports.requireRole)(['ADMIN', 'OWNER']);
exports.requireAdminOrManager = (0, exports.requireRole)(['ADMIN', 'MANAGER']);
exports.requireManagementLevel = (0, exports.requireRole)(['ADMIN', 'OWNER', 'MANAGER']);
// For viewing live matches (regular users after sports hall)
const requireSportsHallAccess = (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({
                message: 'Authentication required'
            });
            return;
        }
        const userRole = req.user.role;
        // Management roles can always access
        if (['ADMIN', 'OWNER', 'MANAGER'].includes(userRole)) {
            return next();
        }
        // Regular users can only see live matches
        if (userRole === 'USER') {
            // Additional check: only show live matches for regular users
            req.query.status = 'live'; // Force live status filter
            return next();
        }
        res.status(403).json({
            message: 'Access denied. Regular users can only view live matches.'
        });
        return;
    }
    catch (error) {
        console.error('Sports hall access error:', error);
        res.status(500).json({
            message: 'Authorization error'
        });
        return;
    }
};
exports.requireSportsHallAccess = requireSportsHallAccess;
