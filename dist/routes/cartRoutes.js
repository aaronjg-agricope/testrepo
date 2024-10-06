"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_1 = require("../controllers/cart"); // Adjust the path based on your project structure
const is_auth_1 = __importDefault(require("../middleware/is-auth")); // Update path as needed
const router = express_1.default.Router();
// Route to add an item to the cart
router.post('/add-item', is_auth_1.default, cart_1.addItemToCart);
// Route to remove an item from the cart
router.post('/remove-item', is_auth_1.default, cart_1.removeItemFromCart);
// Route to update the quantity of an item in the cart
router.post('/update-quantity', is_auth_1.default, cart_1.updateCartItemQuantity);
// Route to get the cart's contents
router.get('/:restaurantId', is_auth_1.default, cart_1.getCart);
exports.default = router;
