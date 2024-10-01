import { Request, Response } from 'express';
import Product from '../models/product'; // Adjust the path based on your project structure
import { RequestHandler } from 'express';


// Retrieve all products
// Retrieve all products with minimum price calculation
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await Product.find();
  
      const productsWithMinPrice = products.map((product) => {
        // Calculate the minimum price across all variants and priceDetails
        const minPrice = product.variants.reduce((min, variant) => {
          const variantMinPrice = Math.min(...variant.priceDetails.map(pd => pd.price));
          return variantMinPrice < min ? variantMinPrice : min;
        }, Infinity);
  
        // Return the product with the minimum price included
        return {
          ...product.toObject(),
          minPrice
        };
      });
  
      res.status(200).json(productsWithMinPrice);
    } catch (err) {
        const error = err as Error
      res.status(500).json({ message: error.message });
    }
  };

// Retrieve products based on category
export const getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
    const { category } = req.body;
    try {
        const products = await Product.find({ category });
        res.status(200).json(products);
    } catch (err) {
        const error = err as Error
        res.status(500).json({ message: error.message });
    }
};

// Retrieve specific product and its inventory
// Retrieve specific product and its inventory details
export const getProductById: RequestHandler<{ id: string }, SuccessfulRequest, {}> = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            res.status(404).json({ message: 'Product not found' });
        } else {
            const inventoryDetails = product.variants.map(variant => ({
                countryOrigin: variant.countryOrigin,
                priceDetails: variant.priceDetails.map(detail => ({
                    packagingWeight: detail.packagingWeight,
                    type: detail.type,
                    price: detail.price,
                    inventory: detail.inventory
                }))
            }));

            res.status(200).json({ product});
        }
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};