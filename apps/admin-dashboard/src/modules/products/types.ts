import { z } from 'zod';

const imageSchema = z.object({
  id: z.string().optional(),
  url: z.string(),
});

export const productSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  handle: z.string().optional(),
  description: z.string().optional(),
  images: z.array(imageSchema).optional(),
  thumbnail: z.string().optional(),
  options: z
    .array(
      z.object({
        title: z.string(),
        values: z.array(z.string()),
      })
    )
    .optional(),
});

export type ProductSchemaType = z.infer<typeof productSchema>;
