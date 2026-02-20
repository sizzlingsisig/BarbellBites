import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

type ErrorWithMeta = {
  name?: string;
  message?: string;
  code?: number;
  stack?: string;
};

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  const error = new AppError(`Not Found - ${req.originalUrl}`, 404);
  return next(error);
};

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const error = err as ErrorWithMeta;
  let statusCode = 500;
  let message = 'An unexpected server error occurred.';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid or expired token.';
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = error.message ?? 'Validation failed.';
  } else if (error.code === 11000) {
    statusCode = 409;
    message = 'Duplicate field value entered. This record already exists.';
  }

  return res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : error.stack,
  });
};