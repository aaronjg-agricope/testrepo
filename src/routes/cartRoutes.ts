import express from 'express';
import { addItemToCart, removeItemFromCart, updateCartItemQuantity, getCart } from '../controllers/cart'; // Adjust the path based on your project structure

const router = express.Router();

// Route to add an item to the cart
router.post('/add-item', addItemToCart);

// Route to remove an item from the cart
router.post('/remove-item', removeItemFromCart);

// Route to update the quantity of an item in the cart
router.post('/update-quantity', updateCartItemQuantity);

// Route to get the cart's contents
router.get('/:restaurantId', getCart);

export default router;