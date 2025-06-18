"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTokenMiddleware = createTokenMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function createTokenMiddleware(options) {
    const { secret, headerName = 'authorization' } = options;
    return async function tokenMiddleware(request) {
        const authHeader = request.headers.get(headerName);
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return new res('Authorization token missing', { status: 401 });
        }
        const token = authHeader.substring(7);
        try {
            // Verify JWT token
            jsonwebtoken_1.default.verify(token, secret);
            return res.next();
        }
        catch (error) {
            return new res('Invalid token', { status: 401 });
        }
    };
}
