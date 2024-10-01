import { RequestHandler } from 'express';
import mongoose, { Types } from 'mongoose';
import Restaurant from '../models/restaurant';
import Product from '../models/product'; // Assuming product model is in '../models/product'

// Add a product to favorites
export const addProductToFavorites: RequestHandler = async (req, res, next) => {
    const { restaurantId, productId } = req.body;

    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the product is already in favorites
        if (restaurant.favoriteProducts?.includes(productId)) {
            return res.status(400).json({ message: 'Product is already in favorites' });
        }

        // Add product to favorites
        restaurant.favoriteProducts = restaurant.favoriteProducts || [];
        restaurant.favoriteProducts.push(new Types.ObjectId(productId));
        await restaurant.save();

        res.status(200).json({ message: 'Product added to favorites' });
    } catch (error) {
        next(error);
    }
};


// Show all favorite products
export const showAllFavorites: RequestHandler = async (req, res, next) => {
    const { restaurantId } = req.params;

    try {
        const restaurant = await Restaurant.findById(restaurantId).populate('favoriteProducts');
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const favoriteProducts = restaurant.favoriteProducts || [];
        res.status(200).json({ favoriteProducts });
    } catch (error) {
        next(error);
    }
};

//
export const getDeliveryAddresses: RequestHandler = async (req, res, next) => {
    const { restaurantId } = req.params;
  
    try {
      const restaurant = await Restaurant.findById(restaurantId);
  
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
  
      const deliveryAddresses = restaurant.deliveryAddresses || [];
      res.status(200).json({ deliveryAddresses });
    } catch (error) {
      next(error);
    }
  };

  export const addDeliveryAddress: RequestHandler = async (req, res, next) => {
    const { restaurantId, address } = req.body;

    try {
        const restaurant = await Restaurant.findById(restaurantId);

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
        address._id = new mongoose.Types.ObjectId();

        restaurant.deliveryAddresses.push(address);
        await restaurant.save();

        res.status(200).json({ message: 'Delivery address added successfully', deliveryAddresses: restaurant.deliveryAddresses });
    } catch (error) {
        next(error);
    }
};


// Edit a delivery address
export const editDeliveryAddress: RequestHandler = async (req, res, next) => {
    const { restaurantId, addressId, newAddress } = req.body;

    try {
        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        const addressIndex = restaurant.deliveryAddresses!.findIndex(addr => addr._id?.toString() === addressId);

        if (addressIndex === -1) {
            return res.status(404).json({ message: 'Delivery address not found' });
        }

        restaurant.deliveryAddresses![addressIndex] = { _id: addressId, ...newAddress };
        await restaurant.save();

        res.status(200).json({ message: 'Delivery address updated successfully', deliveryAddresses: restaurant.deliveryAddresses });
    } catch (error) {
        next(error);
    }
};


// Remove a delivery address
export const removeDeliveryAddress: RequestHandler = async (req, res, next) => {
    const { restaurantId, addressId } = req.body;

    try {
        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        restaurant.deliveryAddresses = restaurant.deliveryAddresses!.filter(addr => addr._id?.toString() !== addressId);
        await restaurant.save();

        res.status(200).json({ message: 'Delivery address removed successfully', deliveryAddresses: restaurant.deliveryAddresses });
    } catch (error) {
        next(error);
    }
};

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
