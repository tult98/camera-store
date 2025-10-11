import { z } from 'zod';

export const PostAdminCreateBannerSchema = z.object({
  images: z.array(z.string()),
  is_active: z.boolean(),
});
