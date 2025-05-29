import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"

import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import playerRoutes from "./routes/playerRoutes.js"
import matchRoutes from "./routes/matchRoutes.js"

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
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is healthy" })
})

app.get("/status", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is running" })
})

app.get("/ping", (req, res) => {
    res.status(200).json({ status: "ok", message: "Pong!" })
})
app.get("/api", (req, res) => {
    res.status(200).json({ status: "ok", message: "API is running" })
})

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/players", playerRoutes)
app.use("/api/matches", matchRoutes)

export default app;