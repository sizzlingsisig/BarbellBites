import mongoose, { Schema, type Document, Types } from "mongoose";

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
  owner: Types.ObjectId; // User reference
  title: string;
  slug: string;
  description?: string;
  image?: string;
  visibility: "private" | "public";
  tags: string[];
  ingredients: IIngredient[];
  instructions: string[];
  nutrition: INutrition;
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
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true, index: true },
    description: { type: String },
    image: { type: String },
    visibility: { type: String, enum: ["private", "public"], default: "private" },
    tags: [{ type: String, trim: true }],
    ingredients: { type: [ingredientSchema], required: true },
    instructions: { type: [String], required: true },
    nutrition: { type: nutritionSchema, required: true },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true }
);

// Auto-generate slug from title before save
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

export const Recipe = mongoose.model<IRecipe>("Recipe", recipeSchema);