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
  name: z
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
  parent_category_id: z
    .string()
    .optional()
    .or(z.literal('')),
  rank: z
    .number()
    .optional(),
  metadata: z
    .object({
      is_featured: z
        .boolean()
        .optional(),
      hero_image_url: z
        .string()
        .optional()
        .or(z.literal('')),
    })
    .optional(),
});

export type CategorySchemaType = z.infer<typeof categorySchema>;