import { ZodError, ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

export const validate = (schema: ZodSchema) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'fail',
          errors: error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }

      return next(new AppError('Internal Server Error during validation', 500));
    }
  };