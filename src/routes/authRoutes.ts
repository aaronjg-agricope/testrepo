import express from 'express';
import { signup, login,validateToken  } from '../controllers/auth'; // Adjust the path based on your actual folder structure

const router = express.Router();

// Route for signup
router.post('/signup', signup);

// Route for login
router.post('/login', login);


router.get('/validate-token', validateToken);

export default router;