import type { CookieOptions, Response } from 'express';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const REFRESH_COOKIE_NAME = 'jwt_refresh';

export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 30 * DAY_IN_MS,
};

export const setRefreshTokenCookie = (res: Response, refreshToken: string): void => {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);
};

export const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);
};

export const getRefreshTokenFromCookies = (cookies: Record<string, unknown> | undefined): string | undefined => {
  const token = cookies?.[REFRESH_COOKIE_NAME];
  return typeof token === 'string' ? token : undefined;
};
