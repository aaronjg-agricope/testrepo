"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItemSchema = void 0;
const mongoose_1 = require("mongoose");
exports.CartItemSchema = new mongoose_1.Schema({
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    country: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    packagingWeight: { type: String, required: true },
    type: { type: String, required: true },
});
// Create the virtual 'id' field that returns _id's string representation
exports.CartItemSchema.virtual('id').get(function () {
    return this._id?.toString(); // Explicitly convert to string
});
// Ensure 'id' is included when converting the document to JSON
exports.CartItemSchema.set('toJSON', {
    virtuals: true,
});
exports.CartItemSchema.set('toObject', {
    virtuals: true,
});
const CartSchema = new mongoose_1.Schema({
    restaurant: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: { type: [exports.CartItemSchema], required: true },
    totalPrice: { type: Number, required: true }
});
const Cart = (0, mongoose_1.model)('Cart', CartSchema);
exports.default = Cart;
