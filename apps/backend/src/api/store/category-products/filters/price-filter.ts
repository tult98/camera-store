import type {
  Product,
  ProductVariant,
  PriceFilter as PriceFilterOptions,
  FilterResult,
} from '../types/category-products.types';

export class PriceFilter {
  static apply(
    products: Product[],
    priceFilter: PriceFilterOptions | undefined
  ): FilterResult {
    if (
      !priceFilter ||
      (priceFilter.min === undefined && priceFilter.max === undefined)
    ) {
      return {
        products,
        totalCount: products.length,
      };
    }

    const minPrice = priceFilter.min ? priceFilter.min : undefined;
    const maxPrice = priceFilter.max ? priceFilter.max : undefined;

    const filteredProducts = products.filter((product: Product) => {
      if (!product.variants || product.variants.length === 0) return false;

      return product.variants.some((variant: ProductVariant) => {
        const price = variant.calculated_price?.calculated_amount;
        if (price === null || price === undefined) return false;

        if (minPrice !== undefined && price < minPrice) return false;
        if (maxPrice !== undefined && price > maxPrice) return false;

        return true;
      });
    });

    return {
      products: filteredProducts,
      totalCount: filteredProducts.length,
    };
  }

  static sort(products: Product[], descending: boolean = false): Product[] {
    return [...products].sort((a: Product, b: Product) => {
      const aPrice = Math.min(
        ...(a.variants || []).map(
          (v: ProductVariant) =>
            v.calculated_price?.calculated_amount || Infinity
        )
      );
      const bPrice = Math.min(
        ...(b.variants || []).map(
          (v: ProductVariant) =>
            v.calculated_price?.calculated_amount || Infinity
        )
      );

      if (aPrice === Infinity && bPrice === Infinity) return 0;
      if (aPrice === Infinity) return 1;
      if (bPrice === Infinity) return -1;

      return descending ? bPrice - aPrice : aPrice - bPrice;
    });
  }
}
