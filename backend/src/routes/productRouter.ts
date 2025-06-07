import { Router } from 'express';
const router = Router();

import { roleMiddleware } from '../middlewares/roleMiddleware';
import { authenticate } from '../middlewares/auth.middleware';

import { createProduct, updateProduct, deleteProduct, getProducts } from '../controllers/productController';

router.get("/getAll", authenticate, getProducts);
router.post("/create", authenticate, roleMiddleware(["admin"]), createProduct);
router.put("/update", authenticate, roleMiddleware(["admin"]), updateProduct);
router.delete("/delete", authenticate, roleMiddleware(["admin"]), deleteProduct);

export default router;
