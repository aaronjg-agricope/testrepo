import express from 'express';
import { placeOrder } from '../controllers/order'; // Adjust the path based on your project structure

const router = express.Router();

// Route to place an order
router.post('/place-order', placeOrder);

export default router;