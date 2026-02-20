import { z } from 'zod';

export const RegisterRequest = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please provide a valid gym email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    proteinGoal: z.number().positive().optional(),
  }),
});

export const LoginRequest = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export type RegisterBody = z.infer<typeof RegisterRequest>['body'];
export type LoginBody = z.infer<typeof LoginRequest>['body'];