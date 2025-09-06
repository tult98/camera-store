import type { Product, ApiFilters, FilterResult } from "../types/category-products.types";

export class AttributeFilter {
  static apply(products: Product[], filters: ApiFilters): FilterResult {
    const attributeFilters = Object.entries(filters).filter(
      ([key]) => key !== "tags" && key !== "availability" && key !== "price"
    );

    if (attributeFilters.length === 0) {
      return {
        products,
        totalCount: products.length
      };
    }

    const filterMatches = this.buildFilterMatches(products, attributeFilters);
    const filteredProductIds = this.intersectFilterMatches(filterMatches);
    
    const filteredProducts = products.filter((p: Product) => 
      filteredProductIds.has(p.id)
    );

    return {
      products: filteredProducts,
      totalCount: filteredProducts.length
    };
  }

  private static buildFilterMatches(
    products: Product[], 
    attributeFilters: [string, unknown][]
  ): Map<string, Set<string>> {
    const filterMatches = new Map<string, Set<string>>();

    for (const [attributeKey, attributeValues] of attributeFilters) {
      if (
        !attributeValues ||
        !Array.isArray(attributeValues) ||
        attributeValues.length === 0
      ) {
        continue;
      }

      const matchingProducts = new Set<string>();

      for (const product of products) {
        const productValue = product.product_attributes?.[attributeKey];

        if (productValue && attributeValues.includes(String(productValue))) {
          matchingProducts.add(product.id);
        }
      }

      filterMatches.set(attributeKey, matchingProducts);
    }

    return filterMatches;
  }

  private static intersectFilterMatches(
    filterMatches: Map<string, Set<string>>
  ): Set<string> {
    let filteredProductIds = new Set<string>();
    let isFirstFilter = true;

    for (const [, matchingProducts] of filterMatches) {
      if (isFirstFilter) {
        filteredProductIds = new Set(matchingProducts);
        isFirstFilter = false;
      } else {
        filteredProductIds = new Set(
          [...filteredProductIds].filter((id) => matchingProducts.has(id))
        );
      }
    }

    return filteredProductIds;
  }
}