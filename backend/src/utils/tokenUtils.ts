import { createHash } from 'crypto';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { AppError } from './AppError.js';

type TokenPayload = { id: string };

const getAccessTokenSecret = (): string => {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new AppError('Server configuration error', 500);
  }

  return secret;
};

const getRefreshTokenSecret = (): string => {
  const secret = process.env.JWT_REFRESH_SECRET;

  if (!secret) {
    throw new AppError('Server configuration error', 500);
  }

  return secret;
};

export const signAccessToken = (id: string): string => {
  const expiresIn = (process.env.JWT_ACCESS_EXPIRES_IN || '15m') as SignOptions['expiresIn'];
  return jwt.sign({ id }, getAccessTokenSecret(), { expiresIn });
};

export const signRefreshToken = (id: string): string => {
  const expiresIn = (process.env.JWT_REFRESH_EXPIRES_IN || '30d') as SignOptions['expiresIn'];
  return jwt.sign({ id }, getRefreshTokenSecret(), { expiresIn });
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, getRefreshTokenSecret()) as TokenPayload;
};

export const hashToken = (token: string): string => {
  return createHash('sha256').update(token).digest('hex');
};
