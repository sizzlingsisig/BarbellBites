// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { type IUser } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { HttpStatusCode } from '../constants/httpStatusCodes.js';

// Extend Express request to include authenticated user.
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Read access token from Authorization header.
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', HttpStatusCode.UNAUTHORIZED));
    }

    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      return next(new AppError('Server configuration error', HttpStatusCode.INTERNAL_SERVER));
    }

    const decoded = jwt.verify(token, secret) as { id: string };

    // Ensure the user still exists.
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', HttpStatusCode.UNAUTHORIZED));
    }

    req.user = currentUser;
    return next();
  } catch (error) {
    return next(new AppError('Invalid or expired token. Please log in again.', HttpStatusCode.UNAUTHORIZED));
  }
};