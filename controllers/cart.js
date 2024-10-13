"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCart = exports.removeItemFromCart = exports.updateCartItemQuantity = exports.addItemToCart = void 0;
const cart_1 = __importDefault(require("../models/cart"));
const product_1 = __importDefault(require("../models/product"));
// Add an item to the cart
const addItemToCart = async (req, res, next) => {
    const { restaurantId, productId, countryOrigin, variantIndex, quantity, packagingWeight, type } = req.body;
    console.log(req.body)
    try {
        // Find the product
        const product = await product_1.default.findById(productId);
        console.log(product)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Find the variant
        const variant = product.variants[variantIndex];
        console.log(variant)
        if (!variant) {
            return res.status(404).json({ message: 'Variant not found' });
        }
        // Check if the requested quantity is available in stock
        const priceDetail = variant.priceDetails.find((pd) => pd.packagingWeight === packagingWeight && pd.type === type);
        if (!priceDetail || priceDetail.inventory < quantity) {
            return res.status(400).json({ message: 'Insufficient stock for the selected item' });
        }
        // Find or create the cart
        let cart = await cart_1.default.findOne({ restaurant: restaurantId });
        if (cart) {
            // Check if the item already exists in the cart
            const cartItemIndex = cart.items.findIndex((item) => item.product.toString() === productId &&
                item.packagingWeight === packagingWeight &&
                item.type === type);
            if (cartItemIndex > -1) {
                // Update existing item quantity
                console.log(cart.items[cartItemIndex])
                if (cart.items[cartItemIndex].quantity + quantity > priceDetail.inventory) {
                    return res.status(400).json({ message: 'Exceeding available stock' });
                }
                cart.items[cartItemIndex].quantity += quantity;
            }
            else {
                // Add new item to the cart
                cart.items.push({
                    product: productId,
                    quantity,
                    price: priceDetail.price,
                    country: countryOrigin,
                    packagingWeight,
                    type
                });
            }
        }
        else {
            // Create a new cart
            cart = new cart_1.default({
                restaurant: restaurantId,
                items: [{
                        product: productId,
                        quantity,
                        price: priceDetail.price,
                        packagingWeight,
                        type
                    }],
            });
        }

        console.log("were here")
        // Update total price and save the cart
        cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        await cart.save();
        // Update inventory
        priceDetail.inventory -= quantity;
        await product.save();
        res.status(200).json({ message: 'Item added to cart successfully', cart });
    }
    catch (error) {
        next(error);
    }
};
exports.addItemToCart = addItemToCart;
// Update the quantity of an item in the cart
const updateCartItemQuantity = async (req, res, next) => {
    const { restaurantId, itemId, quantity } = req.body;
    try {
        const cart = await cart_1.default.findOne({ restaurant: restaurantId }).populate('items.product');
        ;
        if (!cart)
            return res.status(404).json({ message: 'Cart not found' });
        const cartItem = cart.items.find(item => item._id.toString() === itemId); // Use _id directly
        if (!cartItem)
            return res.status(404).json({ message: 'Item not found in cart' });
        // Find the corresponding product and price detail to adjust the inventory
        const product = await product_1.default.findById(cartItem.product);
        if (!product)
            return res.status(404).json({ message: 'Product not found' });
        const variantIndex = product.variants.findIndex(variant => variant.priceDetails.some(pd => pd.packagingWeight === cartItem.packagingWeight));
        if (variantIndex === -1)
            return res.status(404).json({ message: 'Variant not found in product' });
        const variant = product.variants[variantIndex];
        const priceDetail = variant.priceDetails.find(pd => pd.packagingWeight === cartItem.packagingWeight);
        if (!priceDetail)
            return res.status(404).json({ message: 'Price detail not found' });
        if (quantity > priceDetail.inventory + cartItem.quantity)
            return res.status(400).json({ message: 'Insufficient stock' });
        // Update the quantity and inventory
        priceDetail.inventory = priceDetail.inventory + cartItem.quantity - quantity;
        cartItem.quantity = quantity;
        // Update total price and save
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        await cart.save();
        await product.save();
        res.status(200).json({ message: 'Item quantity updated successfully', cart });
    }
    catch (error) {
        next(error);
    }
};
exports.updateCartItemQuantity = updateCartItemQuantity;
// Remove an item from the cart
const removeItemFromCart = async (req, res, next) => {
    const { restaurantId, itemId } = req.body;
    try {
        const cart = await cart_1.default.findOne({ restaurant: restaurantId }).populate('items.product');
        ;
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const cartItemIndex = cart.items.findIndex(item => item._id.toString() === itemId); // Find the index using _id
        if (cartItemIndex === -1)
            return res.status(404).json({ message: 'Item not found in cart' });
        cart.items.splice(cartItemIndex, 1); // Remove the item using the index
        // Recalculate the total price and save the cart
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
        await cart.save();
        res.status(200).json({ message: 'Item removed from cart successfully', cart });
    }
    catch (error) {
        next(error);
    }
};
exports.removeItemFromCart = removeItemFromCart;
// Update the quantity of an item in the cart
// // Display cart contents
const getCart = async (req, res, next) => {
    const { restaurantId } = req.params;
    try {
        const cart = await cart_1.default.findOne({ restaurant: restaurantId }).populate('items.product');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    }
    catch (error) {
        next(error);
    }
};
exports.getCart = getCart;
