import { GetBrandsQuerySchema, PostCreateBrandSchema } from "src/api/admin/brands/validators";
import { z } from "zod";

export type PostCreateBrandType = z.infer<typeof PostCreateBrandSchema>;
export type GetBrandsQueryType = z.infer<typeof GetBrandsQuerySchema>;

export type FilterableBrandProps = {
  name?: string | { $ilike?: string };
};
