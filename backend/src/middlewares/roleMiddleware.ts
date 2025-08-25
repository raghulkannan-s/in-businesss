import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware';

export const requireRole = (allowedRoles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
        } catch (error) {
            console.error('Role authorization error:', error);
            return res.status(500).json({ 
                message: 'Authorization error' 
            });
        }
    };
};

// Predefined role combinations
export const requireAdmin = requireRole(['ADMIN']);
export const requireOwner = requireRole(['OWNER']);
export const requireManager = requireRole(['MANAGER']);
export const requireAdminOrOwner = requireRole(['ADMIN', 'OWNER']);
export const requireAdminOrManager = requireRole(['ADMIN', 'MANAGER']);
export const requireManagementLevel = requireRole(['ADMIN', 'OWNER', 'MANAGER']);

// For viewing live matches (regular users after sports hall)
export const requireSportsHallAccess = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
    } catch (error) {
        console.error('Sports hall access error:', error);
        res.status(500).json({ 
            message: 'Authorization error' 
        });
        return;
    }
};