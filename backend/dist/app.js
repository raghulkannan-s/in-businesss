"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const adminRouter_1 = __importDefault(require("./routes/adminRouter"));
const productRouter_1 = __importDefault(require("./routes/productRouter"));
const eligibilityRouter_1 = __importDefault(require("./routes/eligibilityRouter"));
const scoreRouter_1 = __importDefault(require("./routes/scoreRouter"));
app.get("/", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "IN APP API is working"
    });
});
app.use("/users", userRouter_1.default);
app.use('/auth', authRouter_1.default);
app.use("/admin", adminRouter_1.default);
app.use("/products", productRouter_1.default);
app.use('/eligibility', eligibilityRouter_1.default);
app.use("/score", scoreRouter_1.default);
exports.default = app;
