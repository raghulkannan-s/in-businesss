"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000"
];
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error(`Not allowed by CORS: ${origin}`));
        }
    },
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
    preflightContinue: false, optionsSuccessStatus: 204,
};
exports.default = corsOptions;
