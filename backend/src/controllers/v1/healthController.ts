import type { Request, Response } from 'express';
import { HttpStatusCode } from '../../constants/httpStatusCodes.js';
import { backupConnection, primaryConnection } from '../../config/db.js';

type DbStateLabel = 'disconnected' | 'connected' | 'connecting' | 'disconnecting';

function mapReadyState(state: number): DbStateLabel {
	switch (state) {
		case 1:
			return 'connected';
		case 2:
			return 'connecting';
		case 3:
			return 'disconnecting';
		default:
			return 'disconnected';
	}
}

async function pingConnection(connection: typeof primaryConnection): Promise<boolean> {
	if (connection.readyState !== 1 || !connection.db) {
		return false;
	}

	try {
		await connection.db.admin().command({ ping: 1 });
		return true;
	} catch {
		return false;
	}
}

export async function getDbHealth(_req: Request, res: Response) {
	const [primaryPing, backupPing] = await Promise.all([
		pingConnection(primaryConnection),
		pingConnection(backupConnection),
	]);

	const primaryState = mapReadyState(primaryConnection.readyState);
	const backupState = mapReadyState(backupConnection.readyState);
	const hasActiveDb = primaryPing || backupPing;

	return res.status(hasActiveDb ? HttpStatusCode.OK : HttpStatusCode.INTERNAL_SERVER).json({
		status: hasActiveDb ? 'ok' : 'degraded',
		db: {
			primary: {
				state: primaryState,
				host: primaryConnection.host || null,
				name: primaryConnection.name || null,
				ping: primaryPing,
			},
			backup: {
				state: backupState,
				host: backupConnection.host || null,
				name: backupConnection.name || null,
				ping: backupPing,
			},
		},
	});
}
