import { ForgotPasswordBody } from '../../requests/v2/authRequests.js';
import { requestPasswordReset } from '../../services/v2/authService.js';

import { Request, Response } from 'express';
import { RegisterBody, LoginBody } from '../../requests/v2/authRequests.js';
import {
	AuthServiceError,
	registerUser,
	loginUser,
	refreshUserToken,
	revokeRefreshToken,
} from '../../services/v2/authService.js';
import { HttpStatusCode } from '../../constants/httpStatusCodes.js'; 
import {
	clearRefreshTokenCookie,
	getRefreshTokenFromCookies,
	setRefreshTokenCookie,
} from '../../utils/refreshCookie.js';

const mapAuthServiceError = (error: AuthServiceError) => {
	if (error.code === 'EMAIL_ALREADY_EXISTS') {
		return {
			statusCode: HttpStatusCode.STATE_CONFLICT,
			message: error.message,
		};
	}

	if (error.code === 'INVALID_CREDENTIALS' || error.code === 'INVALID_REFRESH_TOKEN') {
		return {
			statusCode: HttpStatusCode.UNAUTHORIZED,
			message: error.message,
		};
	}

	return {
		statusCode: HttpStatusCode.INTERNAL_SERVER,
		message: 'An unexpected authentication error occurred.',
	};
};

export const register = async (
	req: Request<{}, {}, RegisterBody>,
	res: Response,
) => {
	try {
		const result = await registerUser(req.body);

		setRefreshTokenCookie(res, result.refreshToken);

		return res.status(HttpStatusCode.CREATED).json({
			status: 'success',
			accessToken: result.accessToken,
			data: { user: result.user }
		});
	} catch (error) {
		if (error instanceof AuthServiceError) {
			const { statusCode, message } = mapAuthServiceError(error);
			return res.status(statusCode).json({
				status: 'error',
				message,
			});
		}

		return res.status(HttpStatusCode.INTERNAL_SERVER).json({
			status: 'error',
			message: 'An unexpected authentication error occurred.',
		});
	}
};

export const login = async (
	req: Request<{}, {}, LoginBody>,
	res: Response,
) => {
	try {
		const result = await loginUser(req.body);

		setRefreshTokenCookie(res, result.refreshToken);

		return res.status(HttpStatusCode.OK).json({
			status: 'success',
			accessToken: result.accessToken,
			data: { user: result.user }
		});
	} catch (error) {
		if (error instanceof AuthServiceError) {
			const { statusCode, message } = mapAuthServiceError(error);
			return res.status(statusCode).json({
				status: 'error',
				message,
			});
		}

		return res.status(HttpStatusCode.INTERNAL_SERVER).json({
			status: 'error',
			message: 'An unexpected authentication error occurred.',
		});
	}
};

export const getTest = async (req: Request, res: Response) => {
	try {
		return res.status(HttpStatusCode.OK).json({
			status: 'success',
			data: {
				user: req.user
			}
		});
	} catch {
		return res.status(HttpStatusCode.INTERNAL_SERVER).json({
			status: 'error',
			message: 'An unexpected authentication error occurred.',
		});
	}
};

export const refresh = async (req: Request, res: Response) => {
	try {
		const refreshToken = getRefreshTokenFromCookies(req.cookies);

		if (!refreshToken) {
			return res.status(HttpStatusCode.UNAUTHORIZED).json({
				status: 'error',
				message: 'No refresh token found. Please log in.',
			});
		}

		const result = await refreshUserToken(refreshToken);
		setRefreshTokenCookie(res, result.refreshToken);

		return res.status(HttpStatusCode.OK).json({
			status: 'success',
			accessToken: result.accessToken
		});
	} catch (error) {
		if (error instanceof AuthServiceError) {
			const { statusCode, message } = mapAuthServiceError(error);
			return res.status(statusCode).json({
				status: 'error',
				message,
			});
		}

		return res.status(HttpStatusCode.INTERNAL_SERVER).json({
			status: 'error',
			message: 'An unexpected authentication error occurred.',
		});
	}
};

export const logout = async (req: Request, res: Response) => {
	try {
		const refreshToken = getRefreshTokenFromCookies(req.cookies);

		if (refreshToken) {
			await revokeRefreshToken(refreshToken);
		}

		clearRefreshTokenCookie(res);

		return res.status(HttpStatusCode.OK).json({
			status: 'success',
			message: 'Logged out successfully.'
		});
	} catch {
		return res.status(HttpStatusCode.INTERNAL_SERVER).json({
			status: 'error',
			message: 'An unexpected authentication error occurred.',
		});
	}
};


export const forgotPassword = async (
    req: Request<{}, {}, ForgotPasswordBody>,
    res: Response,
) => {
    try {
        await requestPasswordReset(req.body.email);
        
        // Always return success to prevent enumeration
        return res.status(HttpStatusCode.OK).json({
            status: 'success',
            message: 'If an account with that email exists, a password reset link has been sent.',
        });
    } catch {
        return res.status(HttpStatusCode.INTERNAL_SERVER).json({
            status: 'error',
            message: 'An unexpected error occurred.',
        });
    }
};
