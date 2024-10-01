import { v4 as uuidv4 } from 'uuid'; // Using UUID for uniqueness
import { RequestHandler } from 'express';
import Cart from '../models/cart';
import Order from '../models/order';
import Restaurant from '../models/restaurant';

export const placeOrder: RequestHandler = async (req, res, next) => {
    const { restaurantId, paymentMethod, deliveryAddress } = req.body;

    try {
        const cart = await Cart.findOne({ restaurant: restaurantId }).populate('items.product');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the restaurant to get the delivery address details
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant || !restaurant.deliveryAddresses) {
            return res.status(404).json({ message: 'Restaurant or delivery address not found' });
        }

        // Extract the specific delivery address from the restaurant's addresses
        const selectedAddress = restaurant.deliveryAddresses.find(addr => addr._id.toString() === deliveryAddress);
        if (!selectedAddress) {
            return res.status(404).json({ message: 'Selected delivery address not found' });
        }

        // Generate a random, unique order number
        const orderNumber = `ORD-${uuidv4().slice(0, 8).toUpperCase()}-${Date.now()}`;

        // Create the order with the extracted delivery address details
        const order = new Order({
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
    } catch (error) {
        next(error);
    }
};
