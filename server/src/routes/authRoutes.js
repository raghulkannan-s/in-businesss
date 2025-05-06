import express from "express"
import {registerUser, loginUser, verifyToken} from "../controllers/authControllers.js"

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/verify", verifyToken)

export default router