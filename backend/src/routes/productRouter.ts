import { Router } from 'express';
const router = Router();

import { roleMiddleware } from '../middlewares/roleMiddleware';
import { eligibilityCheck } from '../middlewares/eligibilityCheck';
import { authenticate } from '../middlewares/auth.middleware';

import { createProduct, updateProduct, deleteProduct, getProducts } from '../controllers/productController';

router.get("/getAll", authenticate, eligibilityCheck, getProducts);
router.post("/create", authenticate, roleMiddleware(["admin"]), createProduct);
router.put("/update/:id", authenticate, roleMiddleware(["admin"]), updateProduct);
router.delete("/delete/:id", authenticate, roleMiddleware(["admin"]), deleteProduct);

export default router;
