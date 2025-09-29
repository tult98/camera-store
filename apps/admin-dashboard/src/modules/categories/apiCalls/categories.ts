import { sdk } from '@modules/shared/api/medusa-client';
import type { CategorySchemaType } from '../types';

export const fetchCategories = async (query: string = '') => {
  const response = await sdk.admin.productCategory.list({
    q: query,
    limit: 20,
  });
  
  return response.product_categories || [];
};

export const searchCategories = async (inputValue: string) => {
  const categories = await fetchCategories(inputValue);
  
  return categories.map(category => ({
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