import express, { Request, Response, NextFunction } from "express";
import { json, urlencoded } from "body-parser";
import mongoose from "mongoose";
import adminRoutes from "./routes/adminRoutes";
import authRoutes from "./routes/authRoutes";
import cartRoutes from "./routes/cartRoutes";
import orderRoutes from "./routes/orderRoutes";
import productRoutes from "./routes/productRoutes";
import restaurantRoutes from "./routes/restaurantRoutes";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://aaron-george:flmOGC3B9h5j97jI@agricope-test.qvgsd01.mongodb.net/'; // Replace with your actual connection string

// MongoDB connection setup
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error);
  });

// Middleware to set headers for CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


// Register route files
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);
app.use('/product', productRoutes);
app.use('/restaurant', restaurantRoutes);

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});