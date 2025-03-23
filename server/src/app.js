import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"

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

export default app;