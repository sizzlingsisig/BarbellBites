// src/services/authService.ts
import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/tokenUtils.js';

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

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const user = await User.create({ name, email, password });

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

export const loginUser = async (data: LoginUserInput): Promise<AuthResult> => {
  const { email, password } = data;
  
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
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
    throw new AppError('Invalid or expired refresh token.', 401);
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