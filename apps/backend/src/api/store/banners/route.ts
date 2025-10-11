import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { BANNER_MODULE } from '../../../modules/banner';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const bannerModuleService = req.scope.resolve(BANNER_MODULE);

  const [banners] = await bannerModuleService.listAndCountBanners(
    { is_active: true },
    { take: 1 }
  );

  res.json({
    banner: banners[0] || null,
  });
};
