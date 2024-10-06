"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryAddressSchema = void 0;
const mongoose_1 = require("mongoose");
// Define the OwnerDetails schema
const OwnerDetailsSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    idDetails: { type: String, required: true }
}, { _id: false });
// Define the KYCInformation schema
const KYCInformationSchema = new mongoose_1.Schema({
    commercialRegistration: { type: String, required: true },
    ownerDetails: { type: [OwnerDetailsSchema], required: true }
}, { _id: false });
// Define the DeliveryAddress schema
exports.DeliveryAddressSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, auto: true }, // Ensure _id is auto-generated
    label: { type: String, required: true }, // e.g., Home, Office, etc.
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
}, { _id: false });
// Define the main Restaurant schema
const RestaurantSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    phoneVerified: { type: Boolean, default: false },
    whatsappNumber: { type: String, required: true },
    emailAddress: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    kycInformation: { type: KYCInformationSchema, required: true },
    logoImage: { type: String, required: true },
    operationTimings: { type: String },
    socialMediaLinks: { type: [String] },
    cuisine: { type: String },
    favoriteProducts: { type: [mongoose_1.Schema.Types.ObjectId], ref: 'Product' },
    personalizedProductCategories: { type: [String] },
    deliveryAddresses: { type: [exports.DeliveryAddressSchema], default: [], validate: [arrayLimit, '{PATH} exceeds the limit of 3'] } // Max 3 addresses
}, { timestamps: true });
// Helper function to limit the array length
function arrayLimit(val) {
    return val.length <= 3;
}
// Create and export the model
const Restaurant = (0, mongoose_1.model)('Restaurant', RestaurantSchema);
exports.default = Restaurant;
