import express, { type Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './router/authRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import cookieParser from "cookie-parser";

const app: Application = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/v1/auth', authRoutes);

// 404 Fallback (Must be placed AFTER all valid routes)
app.use(notFound);

// Global Error Handler (Must be the absolute last middleware)
app.use(errorHandler);

export default app;