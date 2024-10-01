import { Schema, model, Document, Types } from 'mongoose';

// Define the TypeScript interfaces
export interface IPriceDetails extends Document {
    packagingWeight: string; // Specific packaging size (e.g., 1Kg, 2.5Kg)
    type: string; // Variety or type (e.g., Red, Gala, etc.)
    price: number; // Price for this combination of packaging and type
    inventory: number; // Stock for this combination
}

// Define the Variant interface
export interface IVariant extends Document {
    media: string[]; // Image(s) of the variant
    countryOrigin: string; // Country of origin
    priceDetails: IPriceDetails[]; // List of price, packaging weight, and type combinations
}

// Define the Product interface
export interface IProduct extends Document {
    name: string; // Product name (e.g., Apple, Banana)
    description: string; // Product description
    media: string[]; // General images of the product
    category: string; // Category (e.g., Fruits, Vegetables)
    tags: string[]; // Tags for filtering
    variants: IVariant[]; // Array of product variants (based on country of origin)
}

// Define the PriceDetails Schema
const PriceDetailsSchema = new Schema<IPriceDetails>({
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
const VariantSchema = new Schema<IVariant>({
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
const ProductSchema = new Schema<IProduct>({
    name: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    category:{
      type: String,
      required: true
    },
    tags:{
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
const Product = model<IProduct>('Product', ProductSchema);

export default Product;