
import { Router, Request, Response, NextFunction } from "express"
const router = Router()

import { loginController, registerController, verifyToken } from "../controllers/authController"

function asyncHandler(fn: any) {
	return function (req: Request, res: Response, next: NextFunction) {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
}

router.post("/login", asyncHandler(loginController))
router.post('/register', asyncHandler(registerController))
router.get('/verify', asyncHandler(verifyToken))

export default router