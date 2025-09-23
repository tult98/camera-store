"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagFilter = void 0;
class TagFilter {
    static apply(products, tagValues) {
        if (!tagValues || tagValues.length === 0) {
            return {
                products,
                totalCount: products.length
            };
        }
        const filteredProducts = products.filter((product) => {
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
    static buildQueryFilter(tagValues) {
        if (!tagValues || tagValues.length === 0) {
            return undefined;
        }
        return {
            value: tagValues
        };
    }
}
exports.TagFilter = TagFilter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLWZpbHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcGkvc3RvcmUvY2F0ZWdvcnktcHJvZHVjdHMvZmlsdGVycy90YWctZmlsdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQWEsU0FBUztJQUNwQixNQUFNLENBQUMsS0FBSyxDQUFDLFFBQW1CLEVBQUUsU0FBK0I7UUFDL0QsSUFBSSxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ3pDLE9BQU87Z0JBQ0wsUUFBUTtnQkFDUixVQUFVLEVBQUUsUUFBUSxDQUFDLE1BQU07YUFDNUIsQ0FBQztRQUNKLENBQUM7UUFFRCxNQUFNLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFnQixFQUFFLEVBQUU7WUFDNUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7Z0JBQy9DLE9BQU8sS0FBSyxDQUFDO1lBQ2YsQ0FBQztZQUVELE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2pFLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTztZQUNMLFFBQVEsRUFBRSxnQkFBZ0I7WUFDMUIsVUFBVSxFQUFFLGdCQUFnQixDQUFDLE1BQU07U0FDcEMsQ0FBQztJQUNKLENBQUM7SUFFRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsU0FBK0I7UUFDckQsSUFBSSxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ3pDLE9BQU8sU0FBUyxDQUFDO1FBQ25CLENBQUM7UUFFRCxPQUFPO1lBQ0wsS0FBSyxFQUFFLFNBQVM7U0FDakIsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQWhDRCw4QkFnQ0MifQ==