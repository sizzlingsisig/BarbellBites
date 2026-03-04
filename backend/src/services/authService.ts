// src/services/authService.ts
import mongoose from 'mongoose';
import User from '../models/User.js';
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/tokenUtils.js';

export type AuthServiceErrorCode =
  | 'EMAIL_ALREADY_EXISTS'
  | 'INVALID_CREDENTIALS'
  | 'INVALID_REFRESH_TOKEN';

export class AuthServiceError extends Error {
  public code: AuthServiceErrorCode;

  constructor(code: AuthServiceErrorCode, message: string) {
    super(message);
    this.name = 'AuthServiceError';
    this.code = code;
  }
}

interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

interface LoginUserInput {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterUserInput): Promise<AuthResult> => {
  const { name, email, password } = data;

  const userId = new mongoose.Types.ObjectId();
  const accessToken = signAccessToken(userId.toString());
  const refreshToken = signRefreshToken(userId.toString());
  const refreshTokenHash = hashToken(refreshToken);

  let user;
  try {
    user = await User.create({
      _id: userId,
      name,
      email,
      password,
      refreshToken: refreshTokenHash,
    });
  } catch (error) {
    const isDuplicateEmail =
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: number }).code === 11000;

    if (isDuplicateEmail) {
      throw new AuthServiceError('EMAIL_ALREADY_EXISTS', 'An account with this email already exists.');
    }

    throw error;
  }

  return {
    accessToken,
    refreshToken,
    user: { id: user._id.toString(), name: user.name, email: user.email },
  };
};

export const loginUser = async (data: LoginUserInput): Promise<AuthResult> => {
  const { email, password } = data;
  
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AuthServiceError('INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const accessToken = signAccessToken(user._id.toString());
  const refreshToken = signRefreshToken(user._id.toString());
  const refreshTokenHash = hashToken(refreshToken);

  await User.findByIdAndUpdate(user._id, { refreshToken: refreshTokenHash });

  return {
    accessToken,
    refreshToken,
    user: { id: user._id.toString(), name: user.name, email: user.email },
  };
};

export const refreshUserToken = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken);
  const refreshTokenHash = hashToken(refreshToken);

  const user = await User.findById(decoded.id);
  
  if (!user || user.refreshToken !== refreshTokenHash) {
    throw new AuthServiceError('INVALID_REFRESH_TOKEN', 'Invalid or expired refresh token.');
  }

  const accessToken = signAccessToken(user._id.toString());
  const newRefreshToken = signRefreshToken(user._id.toString());
  const newRefreshTokenHash = hashToken(newRefreshToken);

  await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshTokenHash });

  return { accessToken, refreshToken: newRefreshToken };
};

export const revokeRefreshToken = async (refreshToken: string): Promise<void> => {
  const refreshTokenHash = hashToken(refreshToken);

  await User.findOneAndUpdate(
    { refreshToken: refreshTokenHash },
    { $unset: { refreshToken: 1 } },
  );
};