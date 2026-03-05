export function isMongoConnectivityError(error: unknown): boolean {
	if (!error || typeof error !== 'object') {
		return false;
	}

	const maybeError = error as { name?: string; message?: string; cause?: { code?: string } };
	const name = maybeError.name ?? '';
	const message = maybeError.message ?? '';
	const causeCode = maybeError.cause?.code ?? '';

	return (
		name === 'MongooseServerSelectionError' ||
		/timed out|econnrefused|enotfound|server selection/i.test(message) ||
		['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT'].includes(causeCode)
	);
}

export async function withReadFailover<T>(
	label: string,
	primaryQuery: () => Promise<T>,
	backupQuery: () => Promise<T>,
): Promise<T> {
	try {
		return await primaryQuery();
	} catch (error) {
		if (!isMongoConnectivityError(error)) {
			throw error;
		}

		const message = error instanceof Error ? error.message : String(error);
		console.warn(`[FAILOVER] Primary ${label} failed (${message}). Falling back to backup DB.`);
		return backupQuery();
	}
}

export async function mirrorWriteToBackup(label: string, backupWrite: () => Promise<void>): Promise<void> {
	try {
		await backupWrite();
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.warn(`[DUAL-WRITE] Backup ${label} sync failed (${message}).`);
	}
}
