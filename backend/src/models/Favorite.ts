import mongoose, { Schema, type Document, Types } from 'mongoose';

export interface IFavorite extends Document {
	userId: Types.ObjectId;
	recipeId: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const favoriteSchema = new Schema<IFavorite>(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true, index: true },
	},
	{ timestamps: true },
);

favoriteSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

export const Favorite = mongoose.model<IFavorite>('Favorite', favoriteSchema);