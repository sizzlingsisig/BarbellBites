// src/controllers/authController.ts
import { Request, Response } from 'express';
import { RegisterBody, LoginBody } from '../requests/authRequests.js';
import { registerUser, loginUser, refreshUserToken, revokeRefreshToken } from '../services/authService.js';
import { AppError } from '../utils/AppError.js';
import { HttpStatusCode } from '../constants/httpStatusCodes.js'; 
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  clearRefreshTokenCookie,
  getRefreshTokenFromCookies,
  setRefreshTokenCookie,
} from '../utils/refreshCookie.js';

export const register = asyncHandler(async (req: Request<{}, {}, RegisterBody>, res: Response) => {
  const result = await registerUser(req.body);

  setRefreshTokenCookie(res, result.refreshToken);

  return res.status(HttpStatusCode.CREATED).json({
    status: 'success',
    accessToken: result.accessToken,
    data: { user: result.user }
  });
});

export const login = asyncHandler(async (req: Request<{}, {}, LoginBody>, res: Response) => {
  const result = await loginUser(req.body);

  setRefreshTokenCookie(res, result.refreshToken);

  return res.status(HttpStatusCode.OK).json({
    status: 'success',
    accessToken: result.accessToken,
    data: { user: result.user }
  });
});

export const getTest = asyncHandler(async (req: Request, res: Response) => {
  return res.status(HttpStatusCode.OK).json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = getRefreshTokenFromCookies(req.cookies);

  if (!refreshToken) {
    throw new AppError('No refresh token found. Please log in.', HttpStatusCode.UNAUTHORIZED);
  }

  const result = await refreshUserToken(refreshToken);
  setRefreshTokenCookie(res, result.refreshToken);

  return res.status(HttpStatusCode.OK).json({
    status: 'success',
    accessToken: result.accessToken
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = getRefreshTokenFromCookies(req.cookies);

  if (refreshToken) {
    await revokeRefreshToken(refreshToken);
  }

  clearRefreshTokenCookie(res);

  return res.status(HttpStatusCode.OK).json({
    status: 'success',
    message: 'Logged out successfully.'
  });
});