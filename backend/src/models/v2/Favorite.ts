import mongoose, { Schema, type Document, Types } from 'mongoose';
import { backupConnection, primaryConnection } from '../../config/db.js';

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

export const PrimaryFavorite =
	(primaryConnection.models.Favorite as mongoose.Model<IFavorite>) ||
	primaryConnection.model<IFavorite>('Favorite', favoriteSchema);

export const BackupFavorite =
	(backupConnection.models.Favorite as mongoose.Model<IFavorite>) ||
	backupConnection.model<IFavorite>('Favorite', favoriteSchema);

// Keep legacy named export for existing imports.
export const Favorite = PrimaryFavorite;
