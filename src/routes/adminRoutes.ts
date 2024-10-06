import express from 'express';
import { createProduct, editProduct, deleteProduct, addVariant, editVariant, deleteVariant } from '../controllers/admin'; // Adjust the path based on your project structure
import multer from 'multer';
import authMiddleware from '../middleware/is-auth'; // Update path as needed

const router = express.Router();
const storage = multer.memoryStorage(); // Use memory storage so that files are not stored on the disk
const upload = multer({ storage }); // Configure Multer to use memory storage
// Routes for product management
router.post('/create', authMiddleware, upload.array('media'), createProduct);
router.put('/edit/:id',authMiddleware, editProduct);           // Edit an existing product by id
router.delete('/delete/:id',authMiddleware, deleteProduct);    // Delete a product by id

// Routes for product variant management
router.post('/add-variant/:id',authMiddleware,upload.array('media'), addVariant);            // Add a new variant to a product
router.put('/edit-variant/:productId/:variantIndex',authMiddleware, editVariant);   // Edit an existing variant of a product
router.delete('/delete-variant/:productId/:variantIndex',authMiddleware, deleteVariant);  // Delete a variant from a product

export default router;