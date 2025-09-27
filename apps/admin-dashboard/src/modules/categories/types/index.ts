import { z } from 'zod';

export interface CategoryFormData {
  title: string;
  handle: string;
  description: string;
  is_active: boolean;
  is_internal: boolean;
  is_featured: boolean;
  hero_image_url: string;
}

export const categorySchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  handle: z
    .string()
    .min(1, 'Handle is required')
    .max(100, 'Handle must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Handle can only contain lowercase letters, numbers, and hyphens'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  is_active: z
    .boolean(),
  is_internal: z
    .boolean(),
  is_featured: z
    .boolean(),
  hero_image_url: z
    .string()
    .optional()
    .or(z.literal('')),
});

export type CategorySchemaType = z.infer<typeof categorySchema>;