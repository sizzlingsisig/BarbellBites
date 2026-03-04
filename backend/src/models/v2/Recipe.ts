import mongoose, { Schema, type Document, Types } from 'mongoose';
import {
	RECIPE_CUISINES,
	RECIPE_DIETS,
	RECIPE_MEAL_TYPES,
	type RecipeCuisine,
	type RecipeDiet,
	type RecipeMealType,
} from '../../constants/recipeTaxonomy.js';

export interface IIngredient {
	name: string;
	amount: string;
	unit?: string;
}

export interface INutrition {
	calories: number;
	protein: number;
	carbs: number;
	fats: number;
}

export interface IRecipe extends Document {
	owner: Types.ObjectId;
	title: string;
	slug: string;
	description?: string;
	photo?: string;
	image?: string;
	visibility: 'private' | 'public' | 'unlisted';
	diets: RecipeDiet[];
	mealTypes: RecipeMealType[];
	cuisines: RecipeCuisine[];
	prepTime: number;
	cookTime: number;
	totalTime: number;
	servings: number;
	servingSize?: string;
	ingredients: IIngredient[];
	steps: string[];
	nutritionPerServing: INutrition;
	deletedAt?: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

const ingredientSchema = new Schema<IIngredient>(
	{
		name: { type: String, required: true },
		amount: { type: String, required: true },
		unit: { type: String },
	},
	{ _id: false }
);

const nutritionSchema = new Schema<INutrition>(
	{
		calories: { type: Number, required: true },
		protein: { type: Number, required: true },
		carbs: { type: Number, required: true },
		fats: { type: Number, required: true },
	},
	{ _id: false }
);

const recipeSchema = new Schema<IRecipe>(
	{
		owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		title: { type: String, required: true, trim: true },
		slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
		description: { type: String },
		photo: { type: String },
		image: { type: String },
		visibility: { type: String, enum: ['private', 'public', 'unlisted'], default: 'private' },
		diets: { type: [{ type: String, enum: RECIPE_DIETS }], default: [] },
		mealTypes: { type: [{ type: String, enum: RECIPE_MEAL_TYPES }], default: [] },
		cuisines: { type: [{ type: String, enum: RECIPE_CUISINES }], default: [] },
		prepTime: { type: Number, default: 0, min: 0 },
		cookTime: { type: Number, default: 0, min: 0 },
		totalTime: { type: Number, default: 0, min: 0 },
		servings: { type: Number, default: 1, min: 1 },
		servingSize: { type: String, default: '' },
		ingredients: { type: [ingredientSchema], required: true },
		steps: { type: [String], required: true },
		nutritionPerServing: { type: nutritionSchema, required: true },
		deletedAt: { type: Date, default: null, index: true },
	},
	{ timestamps: true }
);

recipeSchema.pre<IRecipe>('validate', function (next) {
	if (!this.slug && this.title) {
		this.slug = this.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)+/g, '')
			.substring(0, 64);
	}
	if (typeof next === 'function') next();
});

recipeSchema.pre<IRecipe>('save', function () {
	if (this.totalTime === 0 && (this.prepTime > 0 || this.cookTime > 0)) {
		this.totalTime = this.prepTime + this.cookTime;
	}
});

export const Recipe = mongoose.model<IRecipe>('Recipe', recipeSchema);
