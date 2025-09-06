import type { Product, FilterResult } from "../types/category-products.types";

export class TagFilter {
  static apply(products: Product[], tagValues: string[] | undefined): FilterResult {
    if (!tagValues || tagValues.length === 0) {
      return {
        products,
        totalCount: products.length
      };
    }

    const filteredProducts = products.filter((product: Product) => {
      if (!product.tags || product.tags.length === 0) {
        return false;
      }

      return product.tags.some(tag => tagValues.includes(tag.value));
    });

    return {
      products: filteredProducts,
      totalCount: filteredProducts.length
    };
  }

  static buildQueryFilter(tagValues: string[] | undefined): { value: string[] } | undefined {
    if (!tagValues || tagValues.length === 0) {
      return undefined;
    }

    return {
      value: tagValues
    };
  }
}