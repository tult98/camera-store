"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const product_attributes_1 = require("../../../../modules/product-attributes");
async function GET(req, res) {
    const { category_id } = req.params;
    // Input validation
    if (!category_id || typeof category_id !== 'string' || category_id.trim() === '') {
        return res.status(400).json({
            error: "Valid category ID is required"
        });
    }
    try {
        const productAttributesModuleService = req.scope.resolve(product_attributes_1.PRODUCT_ATTRIBUTES_MODULE);
        const facetAggregationService = productAttributesModuleService.getFacetAggregationService();
        const facets = await facetAggregationService.getFacetsForCategory(category_id.trim(), req.scope);
        return res.json({
            category_id,
            facets
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error fetching facets for category:", errorMessage);
        return res.status(500).json({
            error: "Failed to fetch facets"
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2ZhY2V0cy9bY2F0ZWdvcnlfaWRdL3JvdXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0Esa0JBZ0NDO0FBbENELCtFQUFrRjtBQUUzRSxLQUFLLFVBQVUsR0FBRyxDQUN2QixHQUFrQixFQUNsQixHQUFtQjtJQUVuQixNQUFNLEVBQUUsV0FBVyxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQTtJQUVsQyxtQkFBbUI7SUFDbkIsSUFBSSxDQUFDLFdBQVcsSUFBSSxPQUFPLFdBQVcsS0FBSyxRQUFRLElBQUksV0FBVyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDO1FBQ2pGLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDMUIsS0FBSyxFQUFFLCtCQUErQjtTQUN2QyxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsSUFBSSxDQUFDO1FBQ0gsTUFBTSw4QkFBOEIsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyw4Q0FBeUIsQ0FBQyxDQUFBO1FBQ25GLE1BQU0sdUJBQXVCLEdBQUcsOEJBQThCLENBQUMsMEJBQTBCLEVBQUUsQ0FBQTtRQUUzRixNQUFNLE1BQU0sR0FBRyxNQUFNLHVCQUF1QixDQUFDLG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7UUFFaEcsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ2QsV0FBVztZQUNYLE1BQU07U0FDUCxDQUFDLENBQUE7SUFFSixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE1BQU0sWUFBWSxHQUFHLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQTtRQUM3RSxPQUFPLENBQUMsS0FBSyxDQUFDLHFDQUFxQyxFQUFFLFlBQVksQ0FBQyxDQUFBO1FBRWxFLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDMUIsS0FBSyxFQUFFLHdCQUF3QjtTQUNoQyxDQUFDLENBQUE7SUFDSixDQUFDO0FBQ0gsQ0FBQyJ9