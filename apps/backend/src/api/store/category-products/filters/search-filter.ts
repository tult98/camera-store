import type { Product, FilterResult } from "../types/category-products.types";

export class SearchFilter {
  static apply(products: Product[], searchQuery: string | undefined): FilterResult {
    if (!searchQuery || searchQuery.trim() === "") {
      return {
        products,
        totalCount: products.length
      };
    }

    const filteredProducts = products.filter((product: Product) => 
      product.title && product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return {
      products: filteredProducts,
      totalCount: filteredProducts.length
    };
  }
}