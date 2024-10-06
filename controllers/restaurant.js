"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeDeliveryAddress = exports.editDeliveryAddress = exports.addDeliveryAddress = exports.getDeliveryAddresses = exports.showAllFavorites = exports.addProductToFavorites = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const restaurant_1 = __importDefault(require("../models/restaurant"));
const product_1 = __importDefault(require("../models/product")); // Assuming product model is in '../models/product'
// Add a product to favorites
const addProductToFavorites = async (req, res, next) => {
    const { restaurantId, productId } = req.body;
    try {
        const restaurant = await restaurant_1.default.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        const product = await product_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Check if the product is already in favorites
        if (restaurant.favoriteProducts?.includes(productId)) {
            return res.status(400).json({ message: 'Product is already in favorites' });
        }
        // Add product to favorites
        restaurant.favoriteProducts = restaurant.favoriteProducts || [];
        restaurant.favoriteProducts.push(new mongoose_1.Types.ObjectId(productId));
        await restaurant.save();
        res.status(200).json({ message: 'Product added to favorites' });
    }
    catch (error) {
        next(error);
    }
};
exports.addProductToFavorites = addProductToFavorites;
// Show all favorite products
const showAllFavorites = async (req, res, next) => {
    const { restaurantId } = req.params;
    try {
        const restaurant = await restaurant_1.default.findById(restaurantId).populate('favoriteProducts');
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        const favoriteProducts = restaurant.favoriteProducts || [];
        res.status(200).json({ favoriteProducts });
    }
    catch (error) {
        next(error);
    }
};
exports.showAllFavorites = showAllFavorites;
//
const getDeliveryAddresses = async (req, res, next) => {
    const { restaurantId } = req.params;
    try {
        const restaurant = await restaurant_1.default.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        const deliveryAddresses = restaurant.deliveryAddresses || [];
        res.status(200).json({ deliveryAddresses });
    }
    catch (error) {
        next(error);
    }
};
exports.getDeliveryAddresses = getDeliveryAddresses;
const addDeliveryAddress = async (req, res, next) => {
    const { restaurantId, address } = req.body;
    try {
        const restaurant = await restaurant_1.default.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        // Ensure that deliveryAddresses is initialized
        if (!restaurant.deliveryAddresses) {
            restaurant.deliveryAddresses = [];
        }
        if (restaurant.deliveryAddresses.length >= 3) {
            return res.status(400).json({ message: 'Maximum of 3 delivery addresses allowed' });
        }
        // Assign a unique _id to the new address if it doesn't already have one
        address._id = new mongoose_1.default.Types.ObjectId();
        restaurant.deliveryAddresses.push(address);
        await restaurant.save();
        res.status(200).json({ message: 'Delivery address added successfully', deliveryAddresses: restaurant.deliveryAddresses });
    }
    catch (error) {
        next(error);
    }
};
exports.addDeliveryAddress = addDeliveryAddress;
// Edit a delivery address
const editDeliveryAddress = async (req, res, next) => {
    const { restaurantId, addressId, newAddress } = req.body;
    try {
        const restaurant = await restaurant_1.default.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        const addressIndex = restaurant.deliveryAddresses.findIndex(addr => addr._id?.toString() === addressId);
        if (addressIndex === -1) {
            return res.status(404).json({ message: 'Delivery address not found' });
        }
        // Update the specific address
        restaurant.deliveryAddresses[addressIndex] = { _id: addressId, ...newAddress };
        await restaurant.save();
        // Get the updated address details
        const updatedAddress = restaurant.deliveryAddresses[addressIndex];
        res.status(200).json({ message: 'Delivery address updated successfully', updatedAddress });
    }
    catch (error) {
        next(error);
    }
};
exports.editDeliveryAddress = editDeliveryAddress;
// Remove a delivery address
const removeDeliveryAddress = async (req, res, next) => {
    const { restaurantId, addressId } = req.body;
    try {
        const restaurant = await restaurant_1.default.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }
        restaurant.deliveryAddresses = restaurant.deliveryAddresses.filter(addr => addr._id?.toString() !== addressId);
        await restaurant.save();
        res.status(200).json({ message: 'Delivery address removed successfully', deliveryAddresses: restaurant.deliveryAddresses });
    }
    catch (error) {
        next(error);
    }
};
exports.removeDeliveryAddress = removeDeliveryAddress;
// exports.updateProfile = async (req, res, next) => {
//   console.log("Test")
//  let imgUrl;
//   if(req.file){
//     const storage = new Storage({
//       keyFilename: './controllers/grounded-will-401605-b2323bae386c.json'
//   });
//   // Upload image to Google Cloud Storage
//         const bucketName = 'receiptsfyp';
//         const filename = `receipts/${Date.now()}.jpeg`;
//         const bucket = storage.bucket(bucketName);
//         const file = bucket.file(filename);
//         await file.save(req.file.buffer, {
//             contentType: 'image/jpeg',
//             public: true
//         });
//       imgUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
//   }
//     const userId = req.params.id
//     const user = await User.findById(userId);
//     const password = req.body.password;
//     if(user.password === password){
//       user.password=password;
//     }else if(!req.body.password){
//     }else{
//     const hashedPw = await bcrypt.hash(password, 12);
//     user.password = hashedPw;}
//     const imageUrl= imgUrl?imgUrl:user.imageUrl;
//     const name = req.body.name
//     const email = req.body.email;
//     const mobile = req.body.mobile
//     try {
//       user.name =name;
//       user.email=email;
//       user.imageUrl = imageUrl;
//       user.mobile=mobile;
//       const updatedUser = await user.save();
//       // const user = await User.findById(req.userId);
//       // user.posts.push(post);
//       // await user.save();
//       res.status(200).json({
//         message: 'user updated successfully!',
//         user: updatedUser,
//         // creator: { _id: user._id, name: user.name }
//       });
//     } catch (err) {
//       res.status(400).send('Bad Request');
//       next(err);
//     }
//   };
