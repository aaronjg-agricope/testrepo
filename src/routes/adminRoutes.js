"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_1 = require("../controllers/admin"); // Adjust the path based on your project structure
const multer_1 = __importDefault(require("multer"));
const is_auth_1 = __importDefault(require("../middleware/is-auth")); // Update path as needed
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage(); // Use memory storage so that files are not stored on the disk
const upload = (0, multer_1.default)({ storage }); // Configure Multer to use memory storage
// Routes for product management
router.post('/create', is_auth_1.default, upload.array('media'), admin_1.createProduct);
router.put('/edit/:id', is_auth_1.default, admin_1.editProduct); // Edit an existing product by id
router.delete('/delete/:id', is_auth_1.default, admin_1.deleteProduct); // Delete a product by id
// Routes for product variant management
router.post('/add-variant/:id', is_auth_1.default, upload.array('media'), admin_1.addVariant); // Add a new variant to a product
router.put('/edit-variant/:productId/:variantIndex', is_auth_1.default, admin_1.editVariant); // Edit an existing variant of a product
router.delete('/delete-variant/:productId/:variantIndex', is_auth_1.default, admin_1.deleteVariant); // Delete a variant from a product
exports.default = router;
