import express, { Request, Response } from "express";
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


const isMobile = (req) =>
  req.headers['user-agent']?.includes('okhttp') || req.headers['authorization'];

const apiRouter = express.Router();

apiRouter.use((req, res, next) => {
  if (isMobile(req)) {
    return bearerAuthMiddleware(req, res, next);
  } else {
    return csrfMiddleware(req, res, () => {
      return cookieSessionAuthMiddleware(req, res, next);
    });
  }
});

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

app.get("/api/csrf-token", (req: Request, res: Response) => {
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
