"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = middleware;
const csrf_1 = require("../lib/csrf");
const token_1 = require("../lib/token");
const csrfMiddleware = (0, csrf_1.createCSRFMiddleware)({
    secret: process.env.CSRF_SECRET,
});
const tokenMiddleware = (0, token_1.createTokenMiddleware)({
    secret: process.env.JWT_SECRET,
});
function isExpoMobileApp(request) {
    const appHeader = request.get('x-app-type');
    return !!(appHeader === 'mobile');
}
function middleware(request, response, next) {
    if (request.path.startsWith('/api/auth') ||
        request.path === '/api/health') {
        return next();
    }
    // Apply middleware for API routes
    if (request.path.startsWith('/api/')) {
        const isMobileApp = isExpoMobileApp(request);
        if (isMobileApp) {
            // Use token middleware for Expo mobile apps
            return tokenMiddleware(request, response, next);
        }
        else {
            // Use CSRF middleware for web applications
            return csrfMiddleware(request, response, next);
        }
    }
    next();
}
