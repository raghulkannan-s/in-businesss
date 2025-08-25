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
            res.status(500).json({ 
                message: 'Authorization error' 
            });
            return;
        }
    };
};

// Generic roleMiddleware function that routes are trying to import
export const roleMiddleware = (allowedRoles: string[]) => {
    return requireRole(allowedRoles);
};

// Predefined role combinations (using lowercase to match Prisma schema)
export const requireAdmin = requireRole(['admin']);
export const requireOwner = requireRole(['owner']);
export const requireManager = requireRole(['manager']);
export const requireAdminOrOwner = requireRole(['admin', 'owner']);
export const requireAdminOrManager = requireRole(['admin', 'manager']);
export const requireManagementLevel = requireRole(['admin', 'owner', 'manager']);

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
        if (['admin', 'owner', 'manager'].includes(userRole)) {
            next();
            return;
        }

        // Regular users can only see live matches
        if (userRole === 'user') {
            // Additional check: only show live matches for regular users
            req.query.status = 'live'; // Force live status filter
            next();
            return;
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
    }
};