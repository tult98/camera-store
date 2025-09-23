"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductQueryBuilderService = void 0;
const utils_1 = require("@medusajs/framework/utils");
const tag_filter_1 = require("../filters/tag-filter");
const MAX_QUERY_LIMIT = 1000;
class ProductQueryBuilderService {
    static buildQueryFilters(categoryIds, filters) {
        const queryFilters = {
            categories: {
                id: categoryIds,
            },
        };
        const tagFilter = tag_filter_1.TagFilter.buildQueryFilter(filters.tags);
        if (tagFilter) {
            queryFilters.tags = tagFilter;
        }
        return queryFilters;
    }
    static buildSortOrder(orderBy) {
        const sortOrder = {};
        if (!orderBy)
            return sortOrder;
        const sortFields = orderBy.split(",");
        sortFields.forEach((field) => {
            const isDescending = field.startsWith("-");
            const fieldName = isDescending ? field.substring(1) : field;
            const direction = isDescending ? "desc" : "asc";
            switch (fieldName.trim()) {
                case "price":
                    break;
                case "name":
                    sortOrder["title"] = direction;
                    break;
                case "created_at":
                    sortOrder["created_at"] = direction;
                    break;
                case "rating":
                    break;
                default:
                    sortOrder[fieldName.trim()] = direction;
                    break;
            }
        });
        return sortOrder;
    }
    static buildGraphQuery(queryFilters, sortOrder, context) {
        return {
            entity: "product",
            fields: [
                "*",
                "variants.*",
                "variants.calculated_price.*",
                "categories.*",
                "tags.*",
                "images.*",
            ],
            filters: queryFilters,
            pagination: {
                skip: 0,
                take: MAX_QUERY_LIMIT,
                order: sortOrder,
            },
            context: {
                variants: {
                    calculated_price: (0, utils_1.QueryContext)({
                        region_id: context.region_id,
                        currency_code: context.currency_code,
                    }),
                },
            },
        };
    }
}
exports.ProductQueryBuilderService = ProductQueryBuilderService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZHVjdC1xdWVyeS1idWlsZGVyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2NhdGVnb3J5LXByb2R1Y3RzL3NlcnZpY2VzL3Byb2R1Y3QtcXVlcnktYnVpbGRlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFEQUF5RDtBQU96RCxzREFBa0Q7QUFFbEQsTUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDO0FBRTdCLE1BQWEsMEJBQTBCO0lBQ3JDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FDdEIsV0FBcUIsRUFDckIsT0FBbUI7UUFFbkIsTUFBTSxZQUFZLEdBQWlCO1lBQ2pDLFVBQVUsRUFBRTtnQkFDVixFQUFFLEVBQUUsV0FBVzthQUNoQjtTQUNGLENBQUM7UUFFRixNQUFNLFNBQVMsR0FBRyxzQkFBUyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzRCxJQUFJLFNBQVMsRUFBRSxDQUFDO1lBQ2QsWUFBWSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7UUFDaEMsQ0FBQztRQUVELE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQWU7UUFDbkMsTUFBTSxTQUFTLEdBQWMsRUFBRSxDQUFDO1FBRWhDLElBQUksQ0FBQyxPQUFPO1lBQUUsT0FBTyxTQUFTLENBQUM7UUFFL0IsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUV0QyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDM0IsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzQyxNQUFNLFNBQVMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztZQUM1RCxNQUFNLFNBQVMsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBRWhELFFBQVEsU0FBUyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUM7Z0JBQ3pCLEtBQUssT0FBTztvQkFDVixNQUFNO2dCQUNSLEtBQUssTUFBTTtvQkFDVCxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsU0FBUyxDQUFDO29CQUMvQixNQUFNO2dCQUNSLEtBQUssWUFBWTtvQkFDZixTQUFTLENBQUMsWUFBWSxDQUFDLEdBQUcsU0FBUyxDQUFDO29CQUNwQyxNQUFNO2dCQUNSLEtBQUssUUFBUTtvQkFDWCxNQUFNO2dCQUNSO29CQUNFLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUM7b0JBQ3hDLE1BQU07WUFDVixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQsTUFBTSxDQUFDLGVBQWUsQ0FDcEIsWUFBMEIsRUFDMUIsU0FBb0IsRUFDcEIsT0FBaUM7UUFFakMsT0FBTztZQUNMLE1BQU0sRUFBRSxTQUFrQjtZQUMxQixNQUFNLEVBQUU7Z0JBQ04sR0FBRztnQkFDSCxZQUFZO2dCQUNaLDZCQUE2QjtnQkFDN0IsY0FBYztnQkFDZCxRQUFRO2dCQUNSLFVBQVU7YUFDWDtZQUNELE9BQU8sRUFBRSxZQUFZO1lBQ3JCLFVBQVUsRUFBRTtnQkFDVixJQUFJLEVBQUUsQ0FBQztnQkFDUCxJQUFJLEVBQUUsZUFBZTtnQkFDckIsS0FBSyxFQUFFLFNBQVM7YUFDakI7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsUUFBUSxFQUFFO29CQUNSLGdCQUFnQixFQUFFLElBQUEsb0JBQVksRUFBQzt3QkFDN0IsU0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTO3dCQUM1QixhQUFhLEVBQUUsT0FBTyxDQUFDLGFBQWE7cUJBQ3JDLENBQUM7aUJBQ0g7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUFsRkQsZ0VBa0ZDIn0=