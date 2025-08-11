"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.getProducts = exports.getOneProduct = exports.updateProduct = exports.createProduct = void 0;
const db_1 = require("../database/db");
const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, stock, imageUrl } = req.body;
        const product = await db_1.prisma.product.create({
            data: {
                name: name,
                description: description,
                price: parseFloat(price),
                category: category,
                stock: parseInt(stock),
                imageUrl: imageUrl,
                createdBy: req.user.phone
            }
        });
        res.status(201).json({
            message: "Product created successfully",
            product,
        });
    }
    catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Failed to create product" });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id, name, description, price, category, stock, imageUrl } = req.body;
        const product = await db_1.prisma.product.update({
            where: { id },
            data: {
                name: name,
                description: description,
                price: parseFloat(price),
                category: category,
                stock: parseInt(stock),
                imageUrl: imageUrl
            }
        });
        res.status(200).json({
            message: "Product updated successfully",
            product,
        });
    }
    catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Failed to update product" });
    }
};
exports.updateProduct = updateProduct;
const getOneProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await db_1.prisma.product.findUnique({
            where: { id: id }
        });
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.status(200).json({
            message: 'Product retrieved successfully',
            product
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve product' });
    }
};
exports.getOneProduct = getOneProduct;
const getProducts = async (req, res) => {
    try {
        const products = await db_1.prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({
            message: 'Products retrieved successfully',
            products
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve products' });
    }
};
exports.getProducts = getProducts;
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.body;
        await db_1.prisma.product.delete({
            where: { id: id }
        });
        res.status(200).json({
            message: 'Product deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
};
exports.deleteProduct = deleteProduct;
