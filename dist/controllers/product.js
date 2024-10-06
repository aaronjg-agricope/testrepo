"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductById = exports.getProductsByCategory = exports.getAllProducts = void 0;
const product_1 = __importDefault(require("../models/product")); // Adjust the path based on your project structure
// Retrieve all products
// Retrieve all products with minimum price calculation
const getAllProducts = async (req, res) => {
    try {
        const products = await product_1.default.find();
        const productsWithMinPrice = products.map((product) => {
            // Calculate the minimum price across all variants and priceDetails
            const minPrice = product.variants.reduce((min, variant) => {
                const variantMinPrice = Math.min(...variant.priceDetails.map(pd => pd.price));
                return variantMinPrice < min ? variantMinPrice : min;
            }, Infinity);
            // Return the product with the minimum price included
            return {
                ...product.toObject(),
                minPrice
            };
        });
        res.status(200).json(productsWithMinPrice);
    }
    catch (err) {
        const error = err;
        res.status(500).json({ message: error.message });
    }
};
exports.getAllProducts = getAllProducts;
// Retrieve products based on category
const getProductsByCategory = async (req, res) => {
    const { category } = req.body;
    try {
        const products = await product_1.default.find({ category });
        res.status(200).json(products);
    }
    catch (err) {
        const error = err;
        res.status(500).json({ message: error.message });
    }
};
exports.getProductsByCategory = getProductsByCategory;
// Retrieve specific product and its inventory
// Retrieve specific product and its inventory details
const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await product_1.default.findById(id);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
        }
        else {
            const inventoryDetails = product.variants.map(variant => ({
                countryOrigin: variant.countryOrigin,
                priceDetails: variant.priceDetails.map(detail => ({
                    packagingWeight: detail.packagingWeight,
                    type: detail.type,
                    price: detail.price,
                    inventory: detail.inventory
                }))
            }));
            res.status(200).json({ product });
        }
    }
    catch (err) {
        const error = err;
        res.status(500).json({ message: error.message });
    }
};
exports.getProductById = getProductById;
