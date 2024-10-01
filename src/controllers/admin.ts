import { Request, Response } from 'express';
import Product, { IVariant } from '../models/product'; // Adjust the path based on your project structure
import { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid'; // To create unique names for the files
import { BlobServiceClient } from '@azure/storage-blob'; // Import Azure Blob SDK
import dotenv from 'dotenv';
dotenv.config();

// Azure Blob Storage configuration
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || ''; // Load from .env
const containerName = 'product-imgs'; // Replace with your actual container name

// Function to upload file to Azure Blob Storage
const uploadToAzure = async (file: Express.Multer.File): Promise<string> => {
  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient(containerName);

  // Generate a unique name for the blob
  const blobName = uuidv4() + '-' + file.originalname;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // Upload the file buffer to Azure Blob Storage
  await blockBlobClient.uploadData(file.buffer, {
    blobHTTPHeaders: { blobContentType: file.mimetype },
  });

  // Return the URL of the uploaded blob
  return blockBlobClient.url;
};

export const createProduct: RequestHandler = async (req, res, next) => {
  const { name, description, category, tags, variants } = req.body;
  const mediaFiles = req.files as Express.Multer.File[]; // Expecting files from multer

  try {
    // Upload media files to Azure Blob Storage and get URLs
    const mediaUrls = [];
    if (mediaFiles && mediaFiles.length > 0) {
      for (const file of mediaFiles) {
        const mediaUrl = await uploadToAzure(file); // Upload to Azure and get the URL
        mediaUrls.push(mediaUrl);
      }
    }

    // Create a new product with the media URLs
    const product = new Product({
      name,
      description,
      media: mediaUrls, // Store the Azure URLs in the product
      category,
      tags,
      variants: variants || [], // Make variants optional (default to empty array)
    });

    const result = await product.save();
    res.status(201).json({ message: 'Product created!', productId: result._id });
  } catch (error) {
    next(error);
  }
};

// Edit a product
export const editProduct: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, category, tags, variants } = req.body;
  const mediaFiles = req.files as Express.Multer.File[]; // Expecting files from multer

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Upload new media files to Azure Blob Storage and get URLs
    const mediaUrls = [];
    if (mediaFiles && mediaFiles.length > 0) {
      for (const file of mediaFiles) {
        const mediaUrl = await uploadToAzure(file); // Upload to Azure and get the URL
        mediaUrls.push(mediaUrl);
      }
    }

    // Update the product's fields
    product.name = name;
    product.description = description;
    product.media = mediaUrls.length > 0 ? mediaUrls : product.media; // Only update media if new files are uploaded
    product.category = category;
    product.tags = tags;
    product.variants = variants || product.variants; // Keep existing variants if not updated

    const result = await product.save();
    res.status(200).json({ message: 'Product updated!', productId: result._id });
  } catch (error) {
    next(error);
  }
};

// Delete a product
export const deleteProduct: RequestHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
      const product = await Product.findByIdAndDelete(id);

      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      res.status(200).json({ message: 'Product deleted!' });
  } catch (error) {
      next(error);
  }
};

// Add a variant to a product
export const addVariant: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const { countryOrigin, priceDetails } = req.body;
  const mediaFiles = req.files as Express.Multer.File[]; // Expecting files from multer

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Parse priceDetails as it's coming as a string from Postman
    const parsedPriceDetails = typeof priceDetails === 'string' ? JSON.parse(priceDetails) : priceDetails;

    // Upload variant media files to Azure Blob Storage and get URLs
    const mediaUrls = [];
    if (mediaFiles && mediaFiles.length > 0) {
      for (const file of mediaFiles) {
        const mediaUrl = await uploadToAzure(file); // Upload to Azure and get the URL
        mediaUrls.push(mediaUrl);
      }
    }

    const newVariant: IVariant = {
      media: mediaUrls, // Media URLs from Azure Blob
      countryOrigin,
      priceDetails: parsedPriceDetails, // Pass the parsed priceDetails
    } as IVariant; // Ensure the type casting here

    // Add the new variant to the product
    product.variants.push(newVariant);

    const result = await product.save();
    res.status(200).json({ message: 'Variant added!', productId: result._id });
  } catch (error) {
    next(error);
  }
};

// Edit a variant in a product
export const editVariant: RequestHandler = async (req, res, next) => {
  const { productId, variantIndex } = req.params;
  const { countryOrigin, priceDetails } = req.body;
  const mediaFiles = req.files as Express.Multer.File[]; // Expecting files from multer

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const index = parseInt(variantIndex, 10);
    if (isNaN(index) || index < 0 || index >= product.variants.length) {
      return res.status(404).json({ message: 'Variant not found' });
    }

    const variant = product.variants[index];

    // Upload new variant media files to Azure Blob Storage and get URLs
    const mediaUrls = [];
    if (mediaFiles && mediaFiles.length > 0) {
      for (const file of mediaFiles) {
        const mediaUrl = await uploadToAzure(file); // Upload to Azure and get the URL
        mediaUrls.push(mediaUrl);
      }
    }

    // Update the variant's fields
    variant.media = mediaUrls.length > 0 ? mediaUrls : variant.media; // Only update media if new files are uploaded
    variant.countryOrigin = countryOrigin;
    variant.priceDetails = priceDetails; // Update the priceDetails structure

    const result = await product.save();
    res.status(200).json({ message: 'Variant updated!', productId: result._id });
  } catch (error) {
    next(error);
  }
};

// Delete a variant from a product
export const deleteVariant: RequestHandler = async (req, res, next) => {
  const { productId, variantIndex } = req.params;

  try {
      const product = await Product.findById(productId);

      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      const index = parseInt(variantIndex, 10);
      if (isNaN(index) || index < 0 || index >= product.variants.length) {
          return res.status(404).json({ message: 'Variant not found' });
      }

      product.variants.splice(index, 1);

      const result = await product.save();
      res.status(200).json({ message: 'Variant deleted!', productId: result._id });
  } catch (error) {
      next(error);
  }
};