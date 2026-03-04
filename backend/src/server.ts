import express, { type Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import cookieParser from 'cookie-parser';
import { registerApiRoutes } from './routes/api.js';

const app: Application = express();
const corsOrigins = (process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Global Middleware
app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
registerApiRoutes(app);

// 404 Fallback (Must be placed AFTER all valid routes)
app.use(notFound);

// Global Error Handler (Must be the absolute last middleware)
app.use(errorHandler);

export default app;
