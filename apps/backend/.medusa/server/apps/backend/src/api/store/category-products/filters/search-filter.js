"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchFilter = void 0;
class SearchFilter {
    static apply(products, searchQuery) {
        if (!searchQuery || searchQuery.trim() === "") {
            return {
                products,
                totalCount: products.length
            };
        }
        const filteredProducts = products.filter((product) => product.title && product.title.toLowerCase().includes(searchQuery.toLowerCase()));
        return {
            products: filteredProducts,
            totalCount: filteredProducts.length
        };
    }
}
exports.SearchFilter = SearchFilter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLWZpbHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcGkvc3RvcmUvY2F0ZWdvcnktcHJvZHVjdHMvZmlsdGVycy9zZWFyY2gtZmlsdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQWEsWUFBWTtJQUN2QixNQUFNLENBQUMsS0FBSyxDQUFDLFFBQW1CLEVBQUUsV0FBK0I7UUFDL0QsSUFBSSxDQUFDLFdBQVcsSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUM7WUFDOUMsT0FBTztnQkFDTCxRQUFRO2dCQUNSLFVBQVUsRUFBRSxRQUFRLENBQUMsTUFBTTthQUM1QixDQUFDO1FBQ0osQ0FBQztRQUVELE1BQU0sZ0JBQWdCLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQWdCLEVBQUUsRUFBRSxDQUM1RCxPQUFPLENBQUMsS0FBSyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUNqRixDQUFDO1FBRUYsT0FBTztZQUNMLFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsVUFBVSxFQUFFLGdCQUFnQixDQUFDLE1BQU07U0FDcEMsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQWxCRCxvQ0FrQkMifQ==