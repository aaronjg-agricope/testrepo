"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the PriceDetails Schema
const PriceDetailsSchema = new mongoose_1.Schema({
    packagingWeight: {
        type: String, // Packaging size
        required: true
    },
    type: {
        type: String, // Type (e.g., Red, Gala, etc.)
        required: true
    },
    price: {
        type: Number, // Price for this specific combination
        required: true
    },
    inventory: {
        type: Number, // Stock for this combination
        required: true
    }
}, { _id: false }); // No need for unique IDs for price details
// Define the Variant Schema
const VariantSchema = new mongoose_1.Schema({
    media: {
        type: [String],
        required: true
    },
    countryOrigin: {
        type: String,
        required: true
    },
    priceDetails: {
        type: [PriceDetailsSchema], // Array of price details, with each combination of packaging and type
        required: true
    }
}, { _id: false }); // No need for unique IDs for variants
// Define the Main Product Schema
const ProductSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    tags: {
        type: [String]
    },
    media: {
        type: [String],
        required: true
    },
    variants: {
        type: [VariantSchema],
        required: false
    }
}, { timestamps: true }); // Adding timestamps for createdAt and updatedAt
// Create and export the model
const Product = (0, mongoose_1.model)('Product', ProductSchema);
exports.default = Product;
