import { Schema, model, Document, Types } from 'mongoose';
import { DeliveryAddressSchema } from './restaurant'
import { CartItemSchema } from './cart';
interface IBackupOption extends Document {
    product: Types.ObjectId;
    variant: string;
}

interface IOrderItem extends Document {
    product: Types.ObjectId;
    quantity: number;
    price: number;
    backupOption?: IBackupOption;
}

interface IOrder extends Document {
    restaurant: Types.ObjectId;
    items: IOrderItem[];
    totalPrice: number;
    orderPlacedAt: Date;
    paymentMethod: string;
    deliveryAddress: Types.ObjectId;
    orderNumber: string;
    status: string;
}

const BackupOptionSchema = new Schema<IBackupOption>({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: { type: String, required: true }
}, { _id: false });

const OrderItemSchema = new Schema<IOrderItem>({
    product:  CartItemSchema,
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    backupOption: BackupOptionSchema
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
    restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: { type: [CartItemSchema], required: true },
    totalPrice: { type: Number, required: true },
    orderPlacedAt: { type: Date, default: Date.now },
    paymentMethod: { type: String, required: true },
    deliveryAddress: DeliveryAddressSchema, // Use DeliveryAddressSchema instead of ObjectId
    orderNumber: { type: String, unique: true, required: true }, // New field for order number
    status: { type: String, default: 'Confirming order' } 
}, { timestamps: true });

const Order = model<IOrder>('Order', OrderSchema);

export default Order;