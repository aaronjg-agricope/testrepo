"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.validateToken = exports.signup = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const restaurant_1 = __importDefault(require("../models/restaurant")); // Adjust the path as necessary
const mongoose_1 = __importDefault(require("mongoose"));
// import { uploadImageToAzure } from '../services/imageHandler'; // Adjust the path as necessary
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bcryptkey = process.env.bcryptkey;
const signup = async (req, res, next) => {
    const { email, name, password, mobile, whatsappNumber, commercialRegistration, } = req.body;
    let { ownerDetails } = req.body;
    if (typeof ownerDetails === 'string') {
        try {
            ownerDetails = JSON.parse(ownerDetails); // Parse if it's a JSON string
        }
        catch (error) {
            // Handle invalid JSON error
            // return res.status(400).json({ message: "Invalid ownerDetails format" });
        }
    }
    const logoImage = req.file;
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const hashedPw = await bcryptjs_1.default.hash(password, 12);
        const logoImageUrl = "random"; // Replace with your Azure blob storage URL logic
        const restaurant = new restaurant_1.default({
            name,
            phoneNumber: mobile,
            phoneVerified: false,
            whatsappNumber,
            emailAddress: email,
            emailVerified: false,
            password: hashedPw,
            kycInformation: {
                commercialRegistration, // Ensure this is inside kycInformation
                ownerDetails, // Ensure this is inside kycInformation
            },
            logoImage: logoImageUrl,
        });
        const result = await restaurant.save({ session });
        await session.commitTransaction();
        res.status(200).json({ message: 'Restaurant created!', value: { id: result._id } });
    }
    catch (err) {
        await session.abortTransaction();
        next(err);
    }
    finally {
        session.endSession();
    }
};
exports.signup = signup;
const validateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ message: 'Authorization header missing' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, bcryptkey);
        res.status(200).json({ user: decoded, isValid: true });
    }
    catch (err) {
        res.status(401).json({ message: 'Invalid token', isValid: false });
    }
};
exports.validateToken = validateToken;
const login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let isEqual = false;
    try {
        const user = await restaurant_1.default.findOne({ emailAddress: email });
        if (!user) {
            const error = new Error('A user with this email could not be found.');
            error.statusCode = 401;
            throw error;
        }
        // Use type assertion to let TypeScript know user includes a password
        const loadedUser = user;
        isEqual = await bcryptjs_1.default.compare(password, loadedUser.password); // Compare passwords
        if (!isEqual) {
            const error = new Error('Wrong password.');
            error.statusCode = 401;
            throw error;
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({
            email: loadedUser.email,
            userId: loadedUser._id.toString()
        }, bcryptkey, { expiresIn: '1h' });
        res.status(200).json({ message: "Restaurant has been logged in!",
            value: {
                token: token,
                restaurantId: loadedUser._id.toString(),
                email: loadedUser.emailAddress,
                name: loadedUser.name,
                phoneNumber: loadedUser.phoneNumber,
                logoImage: loadedUser.logoImage
            }
        });
    }
    catch (err) {
        const error = err;
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        next(error);
    }
};
exports.login = login;
