import type { QueryInstance } from 'src/utils/category-hierarchy';

interface ProductBrandData {
  product_id: string;
}

export const getProductIdsByBrand = async (
  query: QueryInstance,
  brandId: string
) => {
  const { data } = await query.graph({
    entity: 'product_brand',
    fields: ['product_id'],
    filters: {
      brand_id: brandId,
    },
  });

  return (data as ProductBrandData[] | undefined)?.map((item) => item.product_id);
};
