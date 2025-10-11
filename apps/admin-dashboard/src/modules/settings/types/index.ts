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
