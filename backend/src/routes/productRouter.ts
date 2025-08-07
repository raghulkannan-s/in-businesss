import { Router } from 'express';
const router = Router();

import { roleMiddleware } from '../middlewares/roleMiddleware';
import { authMiddleware } from '../middlewares/authMiddleware';
import { createProduct, updateProduct, deleteProduct, getProducts, getOneProduct } from '../controllers/productController';

router.get("/getAll", getProducts);
router.post("/create", authMiddleware, roleMiddleware(["admin"]), createProduct);
router.put("/update", authMiddleware, roleMiddleware(["admin"]), updateProduct);
router.delete("/delete", authMiddleware, roleMiddleware(["admin"]), deleteProduct);
router.get("/:id", getOneProduct);

export default router;
