"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth"); // Adjust the path based on your actual folder structure
const router = express_1.default.Router();
// Route for signup
router.post('/signup', auth_1.signup);
// Route for login
router.post('/login', auth_1.login);
router.get('/validate-token', auth_1.validateToken);
exports.default = router;
