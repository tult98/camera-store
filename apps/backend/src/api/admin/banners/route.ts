import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { createBannerWorkflow } from 'src/workflows/create-banner';
import z from 'zod';
import { BANNER_MODULE } from '../../../modules/banner';
import { PostAdminCreateBannerSchema } from './validators';

type PostAdminCreateBannerType = z.infer<typeof PostAdminCreateBannerSchema>;

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const bannerModuleService = req.scope.resolve(BANNER_MODULE);

  const [banners] = await bannerModuleService.listAndCountBanners(
    {},
    { take: 1 }
  );

  res.json({
    banner: banners[0] || null,
  });
};

export const POST = async (
  req: MedusaRequest<PostAdminCreateBannerType>,
  res: MedusaResponse
) => {
  const { result } = await createBannerWorkflow(req.scope).run({
    input: req.validatedBody,
  });

  res.json({ banner: result });
};
