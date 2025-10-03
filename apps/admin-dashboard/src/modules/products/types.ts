import { z } from 'zod';

const imageSchema = z.object({
  id: z.string(),
  url: z.string(),
  isThumbnail: z.boolean().optional(),
});

export const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  handle: z.string().optional(),
  description: z.string().optional(),
  images: z.array(imageSchema).optional(),
});

export type ProductSchemaType = z.infer<typeof productSchema>;