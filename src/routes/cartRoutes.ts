import express from 'express';
import { addItemToCart, removeItemFromCart, updateCartItemQuantity, getCart } from '../controllers/cart'; // Adjust the path based on your project structure
import authMiddleware from '../middleware/is-auth'; // Update path as needed

const router = express.Router();

// Route to add an item to the cart
router.post('/add-item',authMiddleware, addItemToCart);

// Route to remove an item from the cart
router.post('/remove-item',authMiddleware, removeItemFromCart);

// Route to update the quantity of an item in the cart
router.post('/update-quantity',authMiddleware, updateCartItemQuantity);

// Route to get the cart's contents
router.get('/:restaurantId',authMiddleware, getCart);

export default router;