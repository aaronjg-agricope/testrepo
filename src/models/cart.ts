import { Schema, model, Document, Types } from 'mongoose';

// Define ICartItem interface and extend the Document

export interface ICartItem extends Document {
    _id: Types.ObjectId; // Include _id explicitly
    country: string;
    product: Types.ObjectId;
    quantity: number;
    price: number;
    packagingWeight: string;
    type: string;
  }
  export interface ICart extends Document {
    _id: Types.ObjectId;
    restaurant: Types.ObjectId;
    items: ICartItem[];
    totalPrice: number;
  }

export const CartItemSchema = new Schema<ICartItem>({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    country: {type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    packagingWeight: { type: String, required: true },
    type: { type: String, required: true },
});

// Create the virtual 'id' field that returns _id's string representation
CartItemSchema.virtual('id').get(function (this: ICartItem) {
    return this._id?.toString(); // Explicitly convert to string
});

// Ensure 'id' is included when converting the document to JSON
CartItemSchema.set('toJSON', {
    virtuals: true,
});
CartItemSchema.set('toObject', {
    virtuals: true,
});

const CartSchema = new Schema<ICart>({
    restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: { type: [CartItemSchema], required: true },
    totalPrice: { type: Number, required: true }
});

const Cart = model<ICart>('Cart', CartSchema);

export default Cart;
