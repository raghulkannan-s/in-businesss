import { Router } from 'express';
const router = Router();

import { roleMiddleware } from '../middlewares/roleMiddleware';
import { tokenVerify } from '../middlewares/tokenVerify';

import { createProduct, updateProduct, deleteProduct, getProducts } from '../controllers/productController';

router.get("/getAll", tokenVerify, getProducts);
router.post("/create", tokenVerify, roleMiddleware(["admin"]), createProduct);
router.put("/update/:id", tokenVerify, roleMiddleware(["admin"]), updateProduct);
router.delete("/delete/:id", tokenVerify, roleMiddleware(["admin"]), deleteProduct);

export default router;
