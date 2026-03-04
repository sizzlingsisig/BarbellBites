import { z } from 'zod';

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid recipe id');

export const favoriteParamsSchema = z.object({
	params: z.object({
		recipeId: objectIdSchema,
	}),
});
