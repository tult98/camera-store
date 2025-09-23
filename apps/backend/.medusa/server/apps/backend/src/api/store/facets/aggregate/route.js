"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const product_attributes_1 = require("../../../../modules/product-attributes");
async function POST(req, res) {
    const body = req.body;
    const { category_id, applied_filters = {}, include_counts = true } = body;
    // Input validation
    if (!category_id || typeof category_id !== 'string' || category_id.trim() === '') {
        return res.status(400).json({
            error: "Valid category ID is required"
        });
    }
    // Get region_id and currency_code from request headers for pricing context
    const region_id = req.headers["region_id"];
    const currency_code = req.headers["currency_code"];
    if (!region_id || !currency_code) {
        return res.status(400).json({
            error: "region_id and currency_code headers are required for pricing data"
        });
    }
    try {
        const productAttributesModuleService = req.scope.resolve(product_attributes_1.PRODUCT_ATTRIBUTES_MODULE);
        const facetAggregationService = productAttributesModuleService.getFacetAggregationService();
        // Get aggregated facet data with pricing context
        const aggregationResult = await facetAggregationService.aggregateFacets(category_id.trim(), applied_filters, include_counts, req.scope, { region_id, currency_code });
        return res.json(aggregationResult);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        const logger = req.scope.resolve("logger");
        logger.error(`Error aggregating facets for category ${category_id}: ${errorMessage}`);
        return res.status(500).json({
            error: "Failed to aggregate facets"
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2ZhY2V0cy9hZ2dyZWdhdGUvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFTQSxvQkFnREM7QUF4REQsK0VBQWtGO0FBUTNFLEtBQUssVUFBVSxJQUFJLENBQ3hCLEdBQWtCLEVBQ2xCLEdBQW1CO0lBRW5CLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUF3QixDQUFBO0lBQ3pDLE1BQU0sRUFBRSxXQUFXLEVBQUUsZUFBZSxHQUFHLEVBQUUsRUFBRSxjQUFjLEdBQUcsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFBO0lBRXpFLG1CQUFtQjtJQUNuQixJQUFJLENBQUMsV0FBVyxJQUFJLE9BQU8sV0FBVyxLQUFLLFFBQVEsSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUM7UUFDakYsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUMxQixLQUFLLEVBQUUsK0JBQStCO1NBQ3ZDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCwyRUFBMkU7SUFDM0UsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQVcsQ0FBQztJQUNyRCxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBVyxDQUFDO0lBRTdELElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNqQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzFCLEtBQUssRUFBRSxtRUFBbUU7U0FDM0UsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELElBQUksQ0FBQztRQUNILE1BQU0sOEJBQThCLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsOENBQXlCLENBQUMsQ0FBQTtRQUNuRixNQUFNLHVCQUF1QixHQUFHLDhCQUE4QixDQUFDLDBCQUEwQixFQUFFLENBQUE7UUFFM0YsaURBQWlEO1FBQ2pELE1BQU0saUJBQWlCLEdBQUcsTUFBTSx1QkFBdUIsQ0FBQyxlQUFlLENBQ3JFLFdBQVcsQ0FBQyxJQUFJLEVBQUUsRUFDbEIsZUFBZSxFQUNmLGNBQWMsRUFDZCxHQUFHLENBQUMsS0FBSyxFQUNULEVBQUUsU0FBUyxFQUFFLGFBQWEsRUFBRSxDQUM3QixDQUFBO1FBRUQsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUE7SUFFcEMsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixNQUFNLFlBQVksR0FBRyxLQUFLLFlBQVksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUE7UUFDN0UsTUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDMUMsTUFBTSxDQUFDLEtBQUssQ0FBQyx5Q0FBeUMsV0FBVyxLQUFLLFlBQVksRUFBRSxDQUFDLENBQUE7UUFFckYsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUMxQixLQUFLLEVBQUUsNEJBQTRCO1NBQ3BDLENBQUMsQ0FBQTtJQUNKLENBQUM7QUFDSCxDQUFDIn0=