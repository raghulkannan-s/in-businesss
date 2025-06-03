import express from "express";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors())

import userRouter from "./routes/userRouter";

app.get("/", (req, res) => {
    res.status(200).json({
        status : "ok",
        message: "IN APP API is working"
    })
});

app.use("/users", userRouter);

export default app;