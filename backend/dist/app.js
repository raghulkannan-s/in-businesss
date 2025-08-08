"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "10mb" }));
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again later.",
}));
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many auth attempts from this IP, try again later.",
});
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const MOBILE_URL = process.env.MOBILE_URL || "exp://localhost:8081";
app.use((0, cors_1.default)({
    origin: [FRONTEND_URL, MOBILE_URL, "http://localhost:3000", "http://localhost:5173", "http://localhost:8081"],
    credentials: true,
    optionsSuccessStatus: 200,
}));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const adminRouter_1 = __importDefault(require("./routes/adminRouter"));
const productRouter_1 = __importDefault(require("./routes/productRouter"));
const scoreRouter_1 = __importDefault(require("./routes/scoreRouter"));
app.get("/", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "IN APP API is working",
    });
});
app.use("/auth", authLimiter, authRouter_1.default);
app.use("/user", userRouter_1.default);
app.use("/admin", adminRouter_1.default);
app.use("/product", productRouter_1.default);
app.use("/score", scoreRouter_1.default);
exports.default = app;
