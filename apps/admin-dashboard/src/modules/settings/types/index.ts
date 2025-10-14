import { z } from 'zod';

export const bannerSchema = z.object({
  images: z.array(
    z.object({
      id: z.string().optional(),
      url: z.string(),
    })
  ),
  is_active: z.boolean(),
});

export type BannerSchemaType = z.infer<typeof bannerSchema>;

export interface Banner {
  id: string;
  images: string[];
  is_active: boolean;
}

export const regionSchema = z.object({
  name: z
    .string()
    .min(1, 'Region name is required')
    .max(100, 'Region name must be less than 100 characters'),
  currency_code: z.string().min(1, 'Currency code is required'),
  countries: z.array(z.string()).optional(),
  payment_providers: z.array(z.string()).optional(),
});

export type RegionSchemaType = z.infer<typeof regionSchema>;
