import { z } from 'zod';

export interface LoginFormData {
  email: string;
  password: string;
}

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;