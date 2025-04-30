import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"

import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"

const app = express()

app.use(express.json())
app.use(cors())
app.use(helmet())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
})

app.use(limiter)

app.get("/", (req, res) => {
    res.send("API is running...")
})

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)

export default app;