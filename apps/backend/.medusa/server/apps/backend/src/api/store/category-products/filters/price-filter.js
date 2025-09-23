"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceFilter = void 0;
const CENTS_TO_DOLLARS = 100;
class PriceFilter {
    static apply(products, priceFilter) {
        if (!priceFilter ||
            (priceFilter.min === undefined && priceFilter.max === undefined)) {
            return {
                products,
                totalCount: products.length
            };
        }
        const minPrice = priceFilter.min
            ? priceFilter.min * CENTS_TO_DOLLARS
            : undefined;
        const maxPrice = priceFilter.max
            ? priceFilter.max * CENTS_TO_DOLLARS
            : undefined;
        const filteredProducts = products.filter((product) => {
            if (!product.variants || product.variants.length === 0)
                return false;
            return product.variants.some((variant) => {
                const price = variant.calculated_price?.calculated_amount;
                if (price === null || price === undefined)
                    return false;
                if (minPrice !== undefined && price < minPrice)
                    return false;
                if (maxPrice !== undefined && price > maxPrice)
                    return false;
                return true;
            });
        });
        return {
            products: filteredProducts,
            totalCount: filteredProducts.length
        };
    }
    static sort(products, descending = false) {
        return [...products].sort((a, b) => {
            const aPrice = Math.min(...(a.variants || []).map((v) => v.calculated_price?.calculated_amount || Infinity));
            const bPrice = Math.min(...(b.variants || []).map((v) => v.calculated_price?.calculated_amount || Infinity));
            if (aPrice === Infinity && bPrice === Infinity)
                return 0;
            if (aPrice === Infinity)
                return 1;
            if (bPrice === Infinity)
                return -1;
            return descending ? bPrice - aPrice : aPrice - bPrice;
        });
    }
}
exports.PriceFilter = PriceFilter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpY2UtZmlsdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2FwaS9zdG9yZS9jYXRlZ29yeS1wcm9kdWN0cy9maWx0ZXJzL3ByaWNlLWZpbHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQSxNQUFNLGdCQUFnQixHQUFHLEdBQUcsQ0FBQztBQUU3QixNQUFhLFdBQVc7SUFDdEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFtQixFQUFFLFdBQTJDO1FBQzNFLElBQ0UsQ0FBQyxXQUFXO1lBQ1osQ0FBQyxXQUFXLENBQUMsR0FBRyxLQUFLLFNBQVMsSUFBSSxXQUFXLENBQUMsR0FBRyxLQUFLLFNBQVMsQ0FBQyxFQUNoRSxDQUFDO1lBQ0QsT0FBTztnQkFDTCxRQUFRO2dCQUNSLFVBQVUsRUFBRSxRQUFRLENBQUMsTUFBTTthQUM1QixDQUFDO1FBQ0osQ0FBQztRQUVELE1BQU0sUUFBUSxHQUFHLFdBQVcsQ0FBQyxHQUFHO1lBQzlCLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxHQUFHLGdCQUFnQjtZQUNwQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ2QsTUFBTSxRQUFRLEdBQUcsV0FBVyxDQUFDLEdBQUc7WUFDOUIsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEdBQUcsZ0JBQWdCO1lBQ3BDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFFZCxNQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFnQixFQUFFLEVBQUU7WUFDNUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQztnQkFBRSxPQUFPLEtBQUssQ0FBQztZQUVyRSxPQUFPLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBdUIsRUFBRSxFQUFFO2dCQUN2RCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsZ0JBQWdCLEVBQUUsaUJBQWlCLENBQUM7Z0JBQzFELElBQUksS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLEtBQUssU0FBUztvQkFBRSxPQUFPLEtBQUssQ0FBQztnQkFFeEQsSUFBSSxRQUFRLEtBQUssU0FBUyxJQUFJLEtBQUssR0FBRyxRQUFRO29CQUFFLE9BQU8sS0FBSyxDQUFDO2dCQUM3RCxJQUFJLFFBQVEsS0FBSyxTQUFTLElBQUksS0FBSyxHQUFHLFFBQVE7b0JBQUUsT0FBTyxLQUFLLENBQUM7Z0JBRTdELE9BQU8sSUFBSSxDQUFDO1lBQ2QsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU87WUFDTCxRQUFRLEVBQUUsZ0JBQWdCO1lBQzFCLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNO1NBQ3BDLENBQUM7SUFDSixDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFtQixFQUFFLGFBQXNCLEtBQUs7UUFDMUQsT0FBTyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBVSxFQUFFLENBQVUsRUFBRSxFQUFFO1lBQ25ELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQ3JCLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FDdkIsQ0FBQyxDQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsaUJBQWlCLElBQUksUUFBUSxDQUN6RSxDQUNGLENBQUM7WUFDRixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUNyQixHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQ3ZCLENBQUMsQ0FBaUIsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLGlCQUFpQixJQUFJLFFBQVEsQ0FDekUsQ0FDRixDQUFDO1lBRUYsSUFBSSxNQUFNLEtBQUssUUFBUSxJQUFJLE1BQU0sS0FBSyxRQUFRO2dCQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3pELElBQUksTUFBTSxLQUFLLFFBQVE7Z0JBQUUsT0FBTyxDQUFDLENBQUM7WUFDbEMsSUFBSSxNQUFNLEtBQUssUUFBUTtnQkFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBRW5DLE9BQU8sVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3hELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBM0RELGtDQTJEQyJ9