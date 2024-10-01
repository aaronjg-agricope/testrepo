import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthRequest extends Request {
  userId?: string; // Adding custom property to the Request interface
}

const authMiddleware = (err: Error, req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  
  const token = authHeader.split(' ')[1];
  let decodedToken: string|JwtPayload;
  
  try {
    decodedToken = jwt.verify(token, 'abcd122432');
  } catch (err) {
    const error = new Error('Not authenticated.');
    error.statusCode = 401;
    throw error;
  }
  
  if (typeof decodedToken === 'string') {
    // Handle the case where decodedToken is a string (if needed)
    const error = new Error('Invalid token format.');
    error.statusCode = 401;
    throw error;
  } else {
    // decodedToken is JwtPayload
    if (!decodedToken.userId) {
      const error = new Error('Invalid token content.');
      error.statusCode = 401;
      throw error;
    }
  req.userId = decodedToken.userId as string; // Ensure TypeScript knows decodedToken has userId
  next();
};
}

export default authMiddleware;
