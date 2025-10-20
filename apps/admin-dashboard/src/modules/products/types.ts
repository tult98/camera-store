import { Brand } from '@/modules/brands/types';
import { AdminProduct } from '@medusajs/types';
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
  attributeTemplateId: z.string().optional(),
  options: z
    .array(
      z.object({
        title: z.string(),
        values: z.array(z.string()),
      })
    )
    .optional(),
  status: z.enum(['draft', 'proposed', 'published', 'rejected']).optional(),
  category_ids: z.array(z.string()).optional(),
  variants: z
    .array(
      z.object({
        title: z.string(),
        prices: z.array(
          z.object({
            amount: z.number(),
            currency_code: z.string(),
          })
        ),
        options: z.record(z.string(), z.string()),
      })
    )
    .optional(),
  sales_channels: z
    .array(
      z.object({
        id: z.string(),
      })
    )
    .optional(),
  additional_data: z
    .object({
      brand_id: z.string().optional(),
    })
    .optional(),
});

export type ProductSchemaType = z.infer<typeof productSchema>;

export type ProductWithBrand = AdminProduct & { brand?: Brand | null };
