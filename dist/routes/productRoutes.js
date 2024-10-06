"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_1 = require("../controllers/product"); // Adjust the path based on your project structure
const router = express_1.default.Router();
// Route to retrieve all products
router.get('/', product_1.getAllProducts);
// Route to retrieve products by category
router.post('/category', product_1.getProductsByCategory);
// Route to retrieve a specific product by ID
router.get('/:id', product_1.getProductById);
exports.default = router;
