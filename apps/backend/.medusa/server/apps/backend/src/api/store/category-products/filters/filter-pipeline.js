"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterPipeline = void 0;
const search_filter_1 = require("./search-filter");
const price_filter_1 = require("./price-filter");
const attribute_filter_1 = require("./attribute-filter");
const tag_filter_1 = require("./tag-filter");
class FilterPipeline {
    constructor(products) {
        this.products = products;
        this.totalCount = products.length;
    }
    applySearch(searchQuery) {
        const result = search_filter_1.SearchFilter.apply(this.products, searchQuery);
        this.products = result.products;
        this.totalCount = result.totalCount;
        return this;
    }
    applyPriceFilter(priceFilter) {
        const result = price_filter_1.PriceFilter.apply(this.products, priceFilter);
        this.products = result.products;
        this.totalCount = result.totalCount;
        return this;
    }
    applyAttributeFilters(filters) {
        if (filters) {
            const result = attribute_filter_1.AttributeFilter.apply(this.products, filters);
            this.products = result.products;
            this.totalCount = result.totalCount;
        }
        return this;
    }
    applyTagFilter(tagValues) {
        const result = tag_filter_1.TagFilter.apply(this.products, tagValues);
        this.products = result.products;
        this.totalCount = result.totalCount;
        return this;
    }
    applySorting(orderBy) {
        if (!orderBy)
            return this;
        if (orderBy.includes("price")) {
            const isPriceDescending = orderBy.includes("-price");
            this.products = price_filter_1.PriceFilter.sort(this.products, isPriceDescending);
        }
        return this;
    }
    applyPagination(offset, itemsPerPage) {
        this.products = this.products.slice(offset, offset + itemsPerPage);
        return this;
    }
    getResults() {
        return {
            products: this.products,
            totalCount: this.totalCount
        };
    }
    static process(products, options) {
        return new FilterPipeline(products)
            .applySearch(options.searchQuery)
            .applyPriceFilter(options.filters?.price)
            .applyAttributeFilters(options.filters)
            .applySorting(options.orderBy)
            .getResults();
    }
}
exports.FilterPipeline = FilterPipeline;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLXBpcGVsaW5lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2FwaS9zdG9yZS9jYXRlZ29yeS1wcm9kdWN0cy9maWx0ZXJzL2ZpbHRlci1waXBlbGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxtREFBK0M7QUFDL0MsaURBQTZDO0FBQzdDLHlEQUFxRDtBQUNyRCw2Q0FBeUM7QUFRekMsTUFBYSxjQUFjO0lBSXpCLFlBQVksUUFBbUI7UUFDN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO0lBQ3BDLENBQUM7SUFFRCxXQUFXLENBQUMsV0FBb0I7UUFDOUIsTUFBTSxNQUFNLEdBQUcsNEJBQVksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUM5RCxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDaEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ3BDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELGdCQUFnQixDQUFDLFdBQWlDO1FBQ2hELE1BQU0sTUFBTSxHQUFHLDBCQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDN0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUNwQyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxxQkFBcUIsQ0FBQyxPQUFvQjtRQUN4QyxJQUFJLE9BQU8sRUFBRSxDQUFDO1lBQ1osTUFBTSxNQUFNLEdBQUcsa0NBQWUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUM3RCxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7WUFDaEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ3RDLENBQUM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxjQUFjLENBQUMsU0FBb0I7UUFDakMsTUFBTSxNQUFNLEdBQUcsc0JBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDaEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBQ3BDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELFlBQVksQ0FBQyxPQUFnQjtRQUMzQixJQUFJLENBQUMsT0FBTztZQUFFLE9BQU8sSUFBSSxDQUFDO1FBRTFCLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1lBQzlCLE1BQU0saUJBQWlCLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsUUFBUSxHQUFHLDBCQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUNyRSxDQUFDO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsZUFBZSxDQUFDLE1BQWMsRUFBRSxZQUFvQjtRQUNsRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxNQUFNLEdBQUcsWUFBWSxDQUFDLENBQUM7UUFDbkUsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsVUFBVTtRQUNSLE9BQU87WUFDTCxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVE7WUFDdkIsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVO1NBQzVCLENBQUM7SUFDSixDQUFDO0lBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFtQixFQUFFLE9BQThCO1FBQ2hFLE9BQU8sSUFBSSxjQUFjLENBQUMsUUFBUSxDQUFDO2FBQ2hDLFdBQVcsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO2FBQ2hDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDO2FBQ3hDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7YUFDdEMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7YUFDN0IsVUFBVSxFQUFFLENBQUM7SUFDbEIsQ0FBQztDQUNGO0FBdEVELHdDQXNFQyJ9