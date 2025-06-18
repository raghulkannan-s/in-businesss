import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import csrf from "csurf";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false,
  })
);
app.use(helmet.referrerPolicy({ policy: "no-referrer" }));
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));
app.use(helmet.permittedCrossDomainPolicies());

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

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

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:8081",
      "exp://192.168.1.35:8081"
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

const csrfMiddleware = csrf({ cookie: true });

import userRouter from "./routes/userRouter";
import authRouter from "./routes/authRouter";
import adminRouter from "./routes/adminRouter";
import productRouter from "./routes/productRouter";
import scoreRouter from "./routes/scoreRouter";

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "IN APP API is working",
  });
});

const isMobile = (req: Request) => {
  const appTypeHeader = req.headers['x-app-type'];
  return appTypeHeader === 'mobile'
};

app.get("/api/csrf-token", csrfMiddleware, (req: Request, res: Response) => {
  if (isMobile(req)) {
    res.status(200).json({
      status: "ok",
      message: "Mobile client - CSRF not required",
      csrfToken: null,
    });
    return;
  }

  res.status(200).json({
    status: "ok",
    message: "IN APP API is working",
    csrfToken: req.csrfToken(),
  });
});

app.use("/user", userRouter);
app.use("/auth", authLimiter, authRouter);
app.use("/admin", adminRouter);
app.use("/product", productRouter);
app.use("/score", scoreRouter);

export default app;
