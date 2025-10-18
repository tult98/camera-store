import { z } from 'zod';

export const PostCreateBrandSchema = z.object({
  name: z.string(),
  image_url: z.string(),
});

export const GetBrandsQuerySchema = z.object({
  q: z.string().optional(),
  limit: z.preprocess((val) => {
    if (typeof val === 'string') {
      return parseInt(val);
    }
    return val;
  }, z.number().optional()),
  offset: z.preprocess((val) => {
    if (typeof val === 'string') {
      return parseInt(val);
    }
    return val;
  }, z.number().optional()),
});
