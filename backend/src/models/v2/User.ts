import mongoose, { Schema, type Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { backupConnection, primaryConnection } from '../../config/db.js';

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	createdAt: Date;
	updatedAt: Date;
	refreshToken?: string;
	comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<IUser>(
	{
		name: {
			type: String,
			required: [true, 'Please add a name'],
		},
		email: {
			type: String,
			required: [true, 'Please add an email'],
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, 'Please add a password'],
			minlength: 8,
			select: false,
		},
		refreshToken: {
			type: String,
		},
	},

	{
		timestamps: true,
	},
);

userSchema.pre('save', async function () {
	if (!this.isModified('password')) {
		return;
	}

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (
	enteredPassword: string,
): Promise<boolean> {
	return await bcrypt.compare(enteredPassword, this.password);
};

export const PrimaryUser =
	(primaryConnection.models.User as mongoose.Model<IUser>) ||
	primaryConnection.model<IUser>('User', userSchema);

export const BackupUser =
	(backupConnection.models.User as mongoose.Model<IUser>) ||
	backupConnection.model<IUser>('User', userSchema);

const User = PrimaryUser;
export default User;
