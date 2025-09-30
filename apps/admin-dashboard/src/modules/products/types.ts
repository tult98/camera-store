import { z } from 'zod';

export const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  handle: z.string().optional(),
  description: z.string().optional(),
});

export type ProductSchemaType = z.infer<typeof productSchema>;