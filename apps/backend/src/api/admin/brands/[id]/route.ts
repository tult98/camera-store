import type { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { PutUpdateBrandType } from 'src/api/admin/brands/types';
import { BRAND_MODULE } from 'src/modules/brand';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const brandModuleService = req.scope.resolve(BRAND_MODULE);
  const { id } = req.params;

  const brand = await brandModuleService.retrieveBrand(id);

  res.json({
    brand,
  });
};

export const PUT = async (
  req: MedusaRequest<PutUpdateBrandType>,
  res: MedusaResponse
) => {
  const brandModuleService = req.scope.resolve(BRAND_MODULE);
  const { id } = req.params;

  const [brand] = await brandModuleService.updateBrands([
    {
      id,
      ...req.validatedBody,
    },
  ]);

  res.json({
    brand,
  });
};
