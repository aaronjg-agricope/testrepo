"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.get('Authorization');
    const token = authHeader.split(' ')[1];
    if (!token)
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.adminId = decoded.adminId;
        next();
    }
    catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
};
exports.authenticateToken = authenticateToken;
