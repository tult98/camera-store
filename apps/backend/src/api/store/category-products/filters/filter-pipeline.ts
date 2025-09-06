import type { Product, FilterResult, ApiFilters } from "../types/category-products.types";
import { SearchFilter } from "./search-filter";
import { PriceFilter } from "./price-filter";
import { AttributeFilter } from "./attribute-filter";
import { TagFilter } from "./tag-filter";

export interface FilterPipelineOptions {
  searchQuery?: string;
  filters?: ApiFilters;
  orderBy?: string;
}

export class FilterPipeline {
  private products: Product[];
  private totalCount: number;

  constructor(products: Product[]) {
    this.products = products;
    this.totalCount = products.length;
  }

  applySearch(searchQuery?: string): FilterPipeline {
    const result = SearchFilter.apply(this.products, searchQuery);
    this.products = result.products;
    this.totalCount = result.totalCount;
    return this;
  }

  applyPriceFilter(priceFilter?: ApiFilters['price']): FilterPipeline {
    const result = PriceFilter.apply(this.products, priceFilter);
    this.products = result.products;
    this.totalCount = result.totalCount;
    return this;
  }

  applyAttributeFilters(filters?: ApiFilters): FilterPipeline {
    if (filters) {
      const result = AttributeFilter.apply(this.products, filters);
      this.products = result.products;
      this.totalCount = result.totalCount;
    }
    return this;
  }

  applyTagFilter(tagValues?: string[]): FilterPipeline {
    const result = TagFilter.apply(this.products, tagValues);
    this.products = result.products;
    this.totalCount = result.totalCount;
    return this;
  }

  applySorting(orderBy?: string): FilterPipeline {
    if (!orderBy) return this;

    if (orderBy.includes("price")) {
      const isPriceDescending = orderBy.includes("-price");
      this.products = PriceFilter.sort(this.products, isPriceDescending);
    }

    return this;
  }

  applyPagination(offset: number, itemsPerPage: number): FilterPipeline {
    this.products = this.products.slice(offset, offset + itemsPerPage);
    return this;
  }

  getResults(): FilterResult {
    return {
      products: this.products,
      totalCount: this.totalCount
    };
  }

  static process(products: Product[], options: FilterPipelineOptions): FilterResult {
    return new FilterPipeline(products)
      .applySearch(options.searchQuery)
      .applyPriceFilter(options.filters?.price)
      .applyAttributeFilters(options.filters)
      .applySorting(options.orderBy)
      .getResults();
  }
}