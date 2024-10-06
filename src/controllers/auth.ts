import bcrypt from 'bcryptjs'
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RequestHandler } from 'express';
import { BlobServiceClient } from '@azure/storage-blob';
import Restaurant from '../models/restaurant'; // Adjust the path as necessary
import mongoose from 'mongoose';
// import { uploadImageToAzure } from '../services/imageHandler'; // Adjust the path as necessary
import dotenv from 'dotenv';
dotenv.config();

interface UserBody{
    email:string;
    password: string;
}
interface OwnerDetails {
  name: string;
  phoneNumber: string;
  idDetails: string;
}

interface SignupRequestBody {
  email: string;
  name: string;
  password: string;
  mobile: string;
  whatsappNumber: string;
  commercialRegistration: string;
  ownerDetails: OwnerDetails[];
  logoImage: Express.Multer.File; // Adjust this based on how you're handling file uploads
}

  interface Request{
    message: string
  }
  interface DecodedToken {
    userId: string;
    email: string;
    iat: number;
    exp: number;
  }

interface User {
    email: any;
    emailAddress: string;
    password: string;
    confirmed: boolean;
    _id: string;
    name?: string; // Optional properties as per your actual User model
    phoneNumber?: string;
    logoImage?: string;
  }

const bcryptkey = process.env.bcryptkey;

  export const signup: RequestHandler<{}, Request | SuccessfulRequest, SignupRequestBody> = async (req, res, next): Promise<void> => {
    const {
      email,
      name,
      password,
      mobile,
      whatsappNumber,
      commercialRegistration,
    } = req.body;
  
    let { ownerDetails } = req.body;
  
    if (typeof ownerDetails === 'string') {
      try {
        ownerDetails = JSON.parse(ownerDetails); // Parse if it's a JSON string
      } catch (error) {
        // Handle invalid JSON error
        // return res.status(400).json({ message: "Invalid ownerDetails format" });
      }
    }
  
    const logoImage = req.file;
  
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const hashedPw = await bcrypt.hash(password, 12);
  
      const logoImageUrl = "random"; // Replace with your Azure blob storage URL logic
  
      const restaurant = new Restaurant({
        name,
        phoneNumber: mobile,
        phoneVerified: false,
        whatsappNumber,
        emailAddress: email,
        emailVerified: false,
        password: hashedPw,
        kycInformation: {
          commercialRegistration, // Ensure this is inside kycInformation
          ownerDetails,           // Ensure this is inside kycInformation
        },
        logoImage: logoImageUrl,
      });
  
      const result = await restaurant.save({ session });
      await session.commitTransaction();
  
      res.status(200).json({ message: 'Restaurant created!', value: { id: result._id } });
    } catch (err) {
      await session.abortTransaction();
      next(err);
    } finally {
      session.endSession();
    }
  };
  
  
  export const validateToken: RequestHandler = async (req, res, next): Promise<void> => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      res.status(401).json({ message: 'Authorization header missing' });
      return;
    }
  
    const token = authHeader.split(' ')[1];
  
    try {
      const decoded = jwt.verify(token, bcryptkey as string) as DecodedToken;
      res.status(200).json({ user: decoded, isValid: true });
    } catch (err) {
      res.status(401).json({ message: 'Invalid token', isValid: false });
    }
  };

  export const login: RequestHandler<{}, Request | SuccessfulRequest, UserBody> = async (req, res, next): Promise<void> => {
    const email = req.body.email;
    const password = req.body.password;
  
    let isEqual: boolean = false;
  
    try {
      const user = await Restaurant.findOne({ emailAddress: email });
  
      if (!user) {
        const error: any = new Error('A user with this email could not be found.');
        error.statusCode = 401;
        throw error;
      }
  
      // Use type assertion to let TypeScript know user includes a password
      const loadedUser = user as unknown as User;
  
      isEqual = await bcrypt.compare(password, loadedUser.password); // Compare passwords
  
      if (!isEqual) {
        const error: any = new Error('Wrong password.');
        error.statusCode = 401;
        throw error;
      }
  
      // Generate JWT token
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        bcryptkey as string,
        { expiresIn: '1h' }
      );
      res.status(200).json({ message: "Restaurant has been logged in!",
        value: {
          token: token,
          restaurantId: loadedUser._id.toString(),
          email: loadedUser.emailAddress,
          name: loadedUser.name,
          phoneNumber: loadedUser.phoneNumber,
          logoImage: loadedUser.logoImage }
        });
    } catch (err) {
      const error = err as Error;
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  };
  



