import { sdk } from '@modules/shared/api/medusa-client';
import type { CategorySchemaType } from '../types';

export const fetchCategories = async (
  query: string = '',
  parentCategoryId?: string | null
) => {
  const params: Parameters<typeof sdk.admin.productCategory.list>[0] = {
    q: query,
    limit: 100,
    include_descendants_tree: true,
    parent_category_id: parentCategoryId,
    fields: '*category_children',
  };

  const response = await sdk.admin.productCategory.list(params);

  return response.product_categories || [];
};

export const searchCategories = async (inputValue: string) => {
  const categories = await fetchCategories(inputValue);

  return categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));
};

export const fetchCategoryById = async (id: string) => {
  const response = await sdk.admin.productCategory.retrieve(id);
  return response.product_category;
};

export const updateCategory = async (id: string, data: CategorySchemaType) => {
  const response = await sdk.admin.productCategory.update(id, data);
  return response.product_category;
};

export const createCategory = async (data: CategorySchemaType) => {
  const response = await sdk.admin.productCategory.create(data);
  return response.product_category;
};

export const deleteCategory = async (id: string) => {
  await sdk.admin.productCategory.delete(id);
  return { id };
};
