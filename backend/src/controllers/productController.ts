import { Request, Response } from 'express';
import { prisma } from '../database/db';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';

export const createProduct = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { name, description, price, category, stock, imageUrl } = req.body;
        const product = await prisma.product.create({
            data: {
                name : name,
                description : description,
                price : parseFloat(price),
                category : category,
                stock: parseInt(stock),
                imageUrl: imageUrl,
                createdBy: (req as any).user.phone
            }
        });

        res.status(201).json({
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ message: "Failed to create product" });
    }
};

export const updateProduct = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id, name, description, price, category, stock, imageUrl } = req.body;

        const product = await prisma.product.update({
            where: { id },
            data: {
                name : name,
                description : description,
                price : parseFloat(price),
                category : category,
                stock: parseInt(stock),
                imageUrl: imageUrl
            }
        });

        res.status(200).json({
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Failed to update product" });
    }
};

export const getOneProduct = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
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
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve product' });
    }
};

export const getProducts = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            message: 'Products retrieved successfully',
            products
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve products' });
    }
};

export const deleteProduct = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { id } = req.body;

        await prisma.product.delete({
            where: { id: id }
        });

        res.status(200).json({
            message: 'Product deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
};


