"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (err, req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, 'abcd122432');
    }
    catch (err) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    if (typeof decodedToken === 'string') {
        // Handle the case where decodedToken is a string (if needed)
        const error = new Error('Invalid token format.');
        error.statusCode = 401;
        throw error;
    }
    else {
        // decodedToken is JwtPayload
        if (!decodedToken.userId) {
            const error = new Error('Invalid token content.');
            error.statusCode = 401;
            throw error;
        }
        req.userId = decodedToken.userId; // Ensure TypeScript knows decodedToken has userId
        next();
    }
    ;
};
exports.default = authMiddleware;
