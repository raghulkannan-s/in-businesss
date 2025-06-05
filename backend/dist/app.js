"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const csurf_1 = __importDefault(require("csurf"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({
    contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false,
}));
app.use(helmet_1.default.referrerPolicy({ policy: "no-referrer" }));
app.use(helmet_1.default.hsts({ maxAge: 31536000, includeSubDomains: true }));
app.use(helmet_1.default.permittedCrossDomainPolicies());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 100 requests per windowMs
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
const csrfProtection = (0, csurf_1.default)({ cookie: true });
app.use(csrfProtection);
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
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
app.get("/api/csrf-token", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "IN APP API is working",
        csrfToken: req.csrfToken(),
    });
});
app.use("/user", userRouter_1.default);
app.use("/auth", authLimiter, authRouter_1.default);
app.use("/admin", adminRouter_1.default);
app.use("/product", productRouter_1.default);
app.use("/score", scoreRouter_1.default);
exports.default = app;
