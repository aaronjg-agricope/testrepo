import express from 'express';
import { signup, login } from '../controllers/auth'; // Adjust the path based on your actual folder structure

const router = express.Router();

// Route for signup
router.post('/signup', signup);

// Route for login
router.post('/login', login);

export default router;