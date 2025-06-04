"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.getProducts = exports.updateProduct = exports.createProduct = void 0;
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
                imageUrl: imageUrl
            }
        });
        res.status(201).json({
            message: 'Product created successfully',
            product
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, stock, imageUrl } = req.body;
        const product = await db_1.prisma.product.update({
            where: { id: parseInt(id) },
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
            message: 'Product updated successfully',
            product
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
};
exports.updateProduct = updateProduct;
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
        const { id } = req.params;
        await db_1.prisma.product.delete({
            where: { id: parseInt(id) }
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
