import { Schema, model, Document, Types } from 'mongoose';

// Define interfaces for the required fields
interface IOwnerDetails {
    name: string;
    phoneNumber: string;
    idDetails: string;
}

interface IKYCInformation {
    commercialRegistration: string;
    ownerDetails: IOwnerDetails[];
}

interface IDeliveryAddress {
    _id: Types.ObjectId;
    label: string;
    streetAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

interface IRestaurant extends Document {
    name: string;
    password: string;
    phoneNumber: string;
    phoneVerified: boolean;
    whatsappNumber: string;
    emailAddress: string;
    emailVerified: boolean;
    kycInformation: IKYCInformation;
    logoImage: string;
    operationTimings?: string;
    socialMediaLinks?: string[];
    cuisine?: string;
    favoriteProducts?: Types.ObjectId[];
    personalizedProductCategories?: string[];
    deliveryAddresses?: IDeliveryAddress[]; // Adding delivery addresses
}

// Define the OwnerDetails schema
const OwnerDetailsSchema = new Schema<IOwnerDetails>({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    idDetails: { type: String, required: true }
}, { _id: false });

// Define the KYCInformation schema
const KYCInformationSchema = new Schema<IKYCInformation>({
    commercialRegistration: { type: String, required: true },
    ownerDetails: { type: [OwnerDetailsSchema], required: true }
}, { _id: false });

// Define the DeliveryAddress schema
const DeliveryAddressSchema = new Schema<IDeliveryAddress>({
    _id: { type: Schema.Types.ObjectId, auto: true }, // Ensure _id is auto-generated
    label: { type: String, required: true }, // e.g., Home, Office, etc.
    streetAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
}, { _id: false });

// Define the main Restaurant schema
const RestaurantSchema = new Schema<IRestaurant>({
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
    favoriteProducts: { type: [Schema.Types.ObjectId], ref: 'Product' },
    personalizedProductCategories: { type: [String] },
    deliveryAddresses: { type: [DeliveryAddressSchema], default: [], validate: [arrayLimit, '{PATH} exceeds the limit of 3'] } // Max 3 addresses
}, { timestamps: true });

// Helper function to limit the array length
function arrayLimit(val: any) {
    return val.length <= 3;
}

// Create and export the model
const Restaurant = model<IRestaurant>('Restaurant', RestaurantSchema);

export default Restaurant;
