"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const restaurantRoutes_1 = __importDefault(require("./routes/restaurantRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://aaron-george:flmOGC3B9h5j97jI@agricope-test.qvgsd01.mongodb.net/'; // Replace with your actual connection string
// MongoDB connection setup
mongoose_1.default
    .connect(MONGODB_URI)
    .then(() => {
    console.log('Connected to MongoDB');
})
    .catch((error) => {
    console.log('Error connecting to MongoDB:', error);
});
// Middleware to set headers for CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
// Register route files
app.use('/admin', adminRoutes_1.default);
app.use('/auth', authRoutes_1.default);
app.use('/cart', cartRoutes_1.default);
app.use('/order', orderRoutes_1.default);
app.use('/product', productRoutes_1.default);
app.use('/restaurant', restaurantRoutes_1.default);
// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
