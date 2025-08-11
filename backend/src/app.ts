import express, { Request, Response } from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import path from "path";

const app = express();

app.use(express.json({ limit: "10mb" }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again later.",
  })
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many auth attempts from this IP, try again later.",
});

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const MOBILE_URL = process.env.MOBILE_URL || "exp://localhost:8081";

app.use(
  cors({
    origin: [FRONTEND_URL, MOBILE_URL, "http://localhost:3000", "http://localhost:5173", "http://localhost:8081"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);


import userRouter from "./routes/userRouter";
import authRouter from "./routes/authRouter";
import adminRouter from "./routes/adminRouter";
import productRouter from "./routes/productRouter";
import scoreRouter from "./routes/scoreRouter";
import teamRouter from "./routes/teamRouter";

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Cricket Manager API is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});


app.use("/auth", authLimiter, authRouter);
app.use("/teams", teamRouter);

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/product", productRouter);
app.use("/score", scoreRouter);

export default app;
