import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

import userRouter from "./routes/userRouter";
import authRouter from "./routes/authRouter";
import adminRouter from "./routes/adminRouter";
import productRouter from "./routes/productRouter";
import eligibilityRouter from "./routes/eligibilityRouter";
import scoreRouter from "./routes/scoreRouter";

app.get("/", (req, res) => {
    res.status(200).json({
        status : "ok",
        message: "IN APP API is working"
    })
});

app.use("/users", userRouter);
app.use('/auth', authRouter);
app.use("/admin", adminRouter);
app.use("/products", productRouter);
app.use('/eligibility', eligibilityRouter);
app.use("/score", scoreRouter);


export default app;