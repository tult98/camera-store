import { GetBrandsQuerySchema, PostCreateBrandSchema, PutUpdateBrandSchema } from "src/api/admin/brands/validators";
import { z } from "zod";

export type PostCreateBrandType = z.infer<typeof PostCreateBrandSchema>;
export type GetBrandsQueryType = z.infer<typeof GetBrandsQuerySchema>;
export type PutUpdateBrandType = z.infer<typeof PutUpdateBrandSchema>;

export type FilterableBrandProps = {
  name?: string | { $ilike?: string };
};
