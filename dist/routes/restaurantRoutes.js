"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const restaurant_1 = require("../controllers/restaurant"); // Adjust the path based on your project structure
const router = express_1.default.Router();
// Route to add a product to the restaurant's favorites
router.post('/add-favorite', restaurant_1.addProductToFavorites);
// Route to show all favorite products for a restaurant
router.get('/favorites/:restaurantId', restaurant_1.showAllFavorites);
router.get('/:restaurantId', restaurant_1.getDeliveryAddresses);
router.post('/add-address', restaurant_1.addDeliveryAddress);
router.put('/edit-address', restaurant_1.editDeliveryAddress);
router.delete('/remove-address', restaurant_1.removeDeliveryAddress);
exports.default = router;
