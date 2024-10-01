import express from 'express';
import { getAllProducts, getProductsByCategory, getProductById } from '../controllers/product'; // Adjust the path based on your project structure

const router = express.Router();

// Route to retrieve all products
router.get('/', getAllProducts);

// Route to retrieve products by category
router.post('/category', getProductsByCategory);

// Route to retrieve a specific product by ID
router.get('/:id', getProductById);

export default router;