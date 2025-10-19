import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import {
  FilterableBrandProps,
  GetBrandsQueryType,
  PostCreateBrandType,
} from 'src/api/admin/brands/types';
import { BRAND_MODULE } from 'src/modules/brand';
import {
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  toPaginatedResponse,
} from 'src/utils/pagination';
import { createBrandWorkflow } from 'src/workflows/create-brand';

export const POST = async (
  req: MedusaRequest<PostCreateBrandType>,
  res: MedusaResponse
) => {
  const { result } = await createBrandWorkflow(req.scope).run({
    input: req.validatedBody,
  });

  res.json({ brand: result });
};

export const GET = async (
  req: MedusaRequest<GetBrandsQueryType>,
  res: MedusaResponse
) => {
  const {
    limit = DEFAULT_LIMIT,
    offset = DEFAULT_OFFSET,
    q,
  } = req.validatedQuery;

  const brandModuleService = req.scope.resolve(BRAND_MODULE);

  const filters: FilterableBrandProps = {};
  if (q) {
    filters.name = { $ilike: `%${q}%` };
  }

  const [brands, count] = await brandModuleService.listAndCountBrands(filters, {
    take: limit,
    skip: offset,
  });

  const paginatedResult = toPaginatedResponse({
    data: brands,
    count,
    limit,
    offset,
    dataKey: 'brands',
  });

  return res.json(paginatedResult);
};
