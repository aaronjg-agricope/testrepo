"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const restaurant_1 = require("./restaurant");
const cart_1 = require("./cart");
const BackupOptionSchema = new mongoose_1.Schema({
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: { type: String, required: true }
}, { _id: false });
const OrderItemSchema = new mongoose_1.Schema({
    product: cart_1.CartItemSchema,
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    backupOption: BackupOptionSchema
}, { _id: false });
const OrderSchema = new mongoose_1.Schema({
    restaurant: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: { type: [cart_1.CartItemSchema], required: true },
    totalPrice: { type: Number, required: true },
    orderPlacedAt: { type: Date, default: Date.now },
    paymentMethod: { type: String, required: true },
    deliveryAddress: restaurant_1.DeliveryAddressSchema, // Use DeliveryAddressSchema instead of ObjectId
    orderNumber: { type: String, unique: true, required: true }, // New field for order number
    status: { type: String, default: 'Confirming order' }
}, { timestamps: true });
const Order = (0, mongoose_1.model)('Order', OrderSchema);
exports.default = Order;
