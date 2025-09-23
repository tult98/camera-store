"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeFilter = void 0;
class AttributeFilter {
    static apply(products, filters) {
        const attributeFilters = Object.entries(filters).filter(([key]) => key !== "tags" && key !== "availability" && key !== "price");
        if (attributeFilters.length === 0) {
            return {
                products,
                totalCount: products.length
            };
        }
        const filterMatches = this.buildFilterMatches(products, attributeFilters);
        const filteredProductIds = this.intersectFilterMatches(filterMatches);
        const filteredProducts = products.filter((p) => filteredProductIds.has(p.id));
        return {
            products: filteredProducts,
            totalCount: filteredProducts.length
        };
    }
    static buildFilterMatches(products, attributeFilters) {
        const filterMatches = new Map();
        for (const [attributeKey, attributeValues] of attributeFilters) {
            if (!attributeValues ||
                !Array.isArray(attributeValues) ||
                attributeValues.length === 0) {
                continue;
            }
            const matchingProducts = new Set();
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
    static intersectFilterMatches(filterMatches) {
        let filteredProductIds = new Set();
        let isFirstFilter = true;
        for (const [, matchingProducts] of filterMatches) {
            if (isFirstFilter) {
                filteredProductIds = new Set(matchingProducts);
                isFirstFilter = false;
            }
            else {
                filteredProductIds = new Set([...filteredProductIds].filter((id) => matchingProducts.has(id)));
            }
        }
        return filteredProductIds;
    }
}
exports.AttributeFilter = AttributeFilter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXR0cmlidXRlLWZpbHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcGkvc3RvcmUvY2F0ZWdvcnktcHJvZHVjdHMvZmlsdGVycy9hdHRyaWJ1dGUtZmlsdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQWEsZUFBZTtJQUMxQixNQUFNLENBQUMsS0FBSyxDQUFDLFFBQW1CLEVBQUUsT0FBbUI7UUFDbkQsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FDckQsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEtBQUssTUFBTSxJQUFJLEdBQUcsS0FBSyxjQUFjLElBQUksR0FBRyxLQUFLLE9BQU8sQ0FDdkUsQ0FBQztRQUVGLElBQUksZ0JBQWdCLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ2xDLE9BQU87Z0JBQ0wsUUFBUTtnQkFDUixVQUFVLEVBQUUsUUFBUSxDQUFDLE1BQU07YUFDNUIsQ0FBQztRQUNKLENBQUM7UUFFRCxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDMUUsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsc0JBQXNCLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFdEUsTUFBTSxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBVSxFQUFFLEVBQUUsQ0FDdEQsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDN0IsQ0FBQztRQUVGLE9BQU87WUFDTCxRQUFRLEVBQUUsZ0JBQWdCO1lBQzFCLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNO1NBQ3BDLENBQUM7SUFDSixDQUFDO0lBRU8sTUFBTSxDQUFDLGtCQUFrQixDQUMvQixRQUFtQixFQUNuQixnQkFBcUM7UUFFckMsTUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLEVBQXVCLENBQUM7UUFFckQsS0FBSyxNQUFNLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQyxJQUFJLGdCQUFnQixFQUFFLENBQUM7WUFDL0QsSUFDRSxDQUFDLGVBQWU7Z0JBQ2hCLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7Z0JBQy9CLGVBQWUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUM1QixDQUFDO2dCQUNELFNBQVM7WUFDWCxDQUFDO1lBRUQsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO1lBRTNDLEtBQUssTUFBTSxPQUFPLElBQUksUUFBUSxFQUFFLENBQUM7Z0JBQy9CLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUVoRSxJQUFJLFlBQVksSUFBSSxlQUFlLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUM7b0JBQ25FLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ25DLENBQUM7WUFDSCxDQUFDO1lBRUQsYUFBYSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUNwRCxDQUFDO1FBRUQsT0FBTyxhQUFhLENBQUM7SUFDdkIsQ0FBQztJQUVPLE1BQU0sQ0FBQyxzQkFBc0IsQ0FDbkMsYUFBdUM7UUFFdkMsSUFBSSxrQkFBa0IsR0FBRyxJQUFJLEdBQUcsRUFBVSxDQUFDO1FBQzNDLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQztRQUV6QixLQUFLLE1BQU0sQ0FBQyxFQUFFLGdCQUFnQixDQUFDLElBQUksYUFBYSxFQUFFLENBQUM7WUFDakQsSUFBSSxhQUFhLEVBQUUsQ0FBQztnQkFDbEIsa0JBQWtCLEdBQUcsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDL0MsYUFBYSxHQUFHLEtBQUssQ0FBQztZQUN4QixDQUFDO2lCQUFNLENBQUM7Z0JBQ04sa0JBQWtCLEdBQUcsSUFBSSxHQUFHLENBQzFCLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ2pFLENBQUM7WUFDSixDQUFDO1FBQ0gsQ0FBQztRQUVELE9BQU8sa0JBQWtCLENBQUM7SUFDNUIsQ0FBQztDQUNGO0FBNUVELDBDQTRFQyJ9