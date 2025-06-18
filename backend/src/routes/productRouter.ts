import { Router } from 'express';
const router = Router();

import { roleMiddleware } from '../middlewares/roleMiddleware';

import { createProduct, updateProduct, deleteProduct, getProducts, getOneProduct } from '../controllers/productController';

// Conditional auth middleware
const conditionalAuth = (req: any, res: any, next: any) => {
next()
};

router.get("/getAll", conditionalAuth, getProducts);
router.post("/create", conditionalAuth, roleMiddleware(["admin"]), createProduct);
router.put("/update", conditionalAuth, roleMiddleware(["admin"]), updateProduct);
router.delete("/delete", conditionalAuth, roleMiddleware(["admin"]), deleteProduct);
router.get("/:id", conditionalAuth, getOneProduct);

export default router;
