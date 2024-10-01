import express from 'express';
import { addProductToFavorites, showAllFavorites,addDeliveryAddress,editDeliveryAddress,removeDeliveryAddress,getDeliveryAddresses } from '../controllers/restaurant'; // Adjust the path based on your project structure

const router = express.Router();

// Route to add a product to the restaurant's favorites
router.post('/add-favorite', addProductToFavorites);

// Route to show all favorite products for a restaurant
router.get('/favorites/:restaurantId', showAllFavorites);

router.get('/:restaurantId', getDeliveryAddresses);
router.post('/add-address', addDeliveryAddress);
router.put('/edit-address', editDeliveryAddress);
router.delete('/remove-address', removeDeliveryAddress);

export default router;