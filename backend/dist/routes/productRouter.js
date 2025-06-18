"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const productController_1 = require("../controllers/productController");
// Conditional auth middleware
const conditionalAuth = (req, res, next) => {
    next();
};
router.get("/getAll", conditionalAuth, productController_1.getProducts);
router.post("/create", conditionalAuth, (0, roleMiddleware_1.roleMiddleware)(["admin"]), productController_1.createProduct);
router.put("/update", conditionalAuth, (0, roleMiddleware_1.roleMiddleware)(["admin"]), productController_1.updateProduct);
router.delete("/delete", conditionalAuth, (0, roleMiddleware_1.roleMiddleware)(["admin"]), productController_1.deleteProduct);
router.get("/:id", conditionalAuth, productController_1.getOneProduct);
exports.default = router;
