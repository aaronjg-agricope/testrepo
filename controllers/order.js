"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOrderById = exports.getAllOrders = exports.placeOrder = void 0;
const uuid_1 = require("uuid"); // Using UUID for uniqueness
const cart_1 = __importDefault(require("../models/cart"));
const order_1 = __importDefault(require("../models/order"));
const restaurant_1 = __importDefault(require("../models/restaurant"));
const placeOrder = async (req, res, next) => {
    const { restaurantId, paymentMethod, deliveryAddress } = req.body;
    try {
        const cart = await cart_1.default.findOne({ restaurant: restaurantId }).populate('items.product');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        // Find the restaurant to get the delivery address details
        const restaurant = await restaurant_1.default.findById(restaurantId);
        if (!restaurant || !restaurant.deliveryAddresses) {
            return res.status(404).json({ message: 'Restaurant or delivery address not found' });
        }
        // Extract the specific delivery address from the restaurant's addresses
        const selectedAddress = restaurant.deliveryAddresses.find(addr => addr._id.toString() === deliveryAddress);
        if (!selectedAddress) {
            return res.status(404).json({ message: 'Selected delivery address not found' });
        }
        // Generate a random, unique order number
        const orderNumber = `ORD-${(0, uuid_1.v4)().slice(0, 8).toUpperCase()}-${Date.now()}`;
        // Create the order with the extracted delivery address details
        const order = new order_1.default({
            restaurant: restaurantId,
            items: cart.items,
            totalPrice: cart.totalPrice,
            paymentMethod,
            deliveryAddress: selectedAddress, // Save the full address object here
            status: 'Confirming order',
            orderNumber // Adding the order number
        });
        await order.save();
        // Clear the cart after placing the order
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();
        res.status(201).json({ message: 'Order placed successfully', order });
    }
    catch (error) {
        next(error);
    }
};
exports.placeOrder = placeOrder;
const getAllOrders = async (req, res, next) => {
    try {
        // Fetch all orders, populate related fields
        const orders = await order_1.default.find()
            .populate('restaurant', 'name') // populate with restaurant name only for display
            .populate('items.product', 'name'); // populate with product name for display
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};
exports.getAllOrders = getAllOrders;
// Controller to fetch a specific order by ID
const getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await order_1.default.findById(id)
            .populate('restaurant', 'name')
            .populate('items.product', 'name');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching order details', error });
    }
};
exports.getOrderById = getOrderById;
const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        // Ensure status is one of the allowed values
        const validStatuses = ["Confirming Order", "Order Confirmed", "Out for Delivery", "Completed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        const order = await order_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order status updated successfully', order });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating order status', error });
    }
};
exports.updateOrderStatus = updateOrderStatus;
