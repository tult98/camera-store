import { z } from 'zod';

export const PostCategoryProductsSchema = z.object({
  category_id: z.string().min(1, 'Category ID is required'),
  page: z.number().min(1).optional(),
  page_size: z.number().min(1).optional(),
  order_by: z.string().min(1).optional(),
  filters: z.record(z.string(), z.any()).optional(),
  search_query: z.string().optional(),
  brand_id: z.string().optional(),
});

export type PostCategoryProductsSchemaType = z.infer<
  typeof PostCategoryProductsSchema
>;
