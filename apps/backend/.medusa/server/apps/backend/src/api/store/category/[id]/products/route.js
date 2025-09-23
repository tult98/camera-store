"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const utils_1 = require("@medusajs/framework/utils");
async function GET(req, res) {
    const { id: categoryId } = req.params;
    const { sortBy = 'popularity', page = '1', limit = '24', q } = req.query;
    // Input validation
    if (!categoryId || typeof categoryId !== 'string' || categoryId.trim() === '') {
        return res.status(400).json({
            error: "Valid category ID is required"
        });
    }
    // Sanitize search query
    const sanitizedQuery = q ? q.trim().slice(0, 100) : undefined;
    const currentPage = parseInt(page, 10);
    const itemsPerPage = parseInt(limit, 10);
    const offset = (currentPage - 1) * itemsPerPage;
    try {
        const productModule = req.scope.resolve(utils_1.Modules.PRODUCT);
        // Build product filters
        const productFilters = {
            categories: { id: [categoryId] }
        };
        // Add text search if provided
        if (sanitizedQuery) {
            productFilters.title = {
                $ilike: `%${sanitizedQuery}%`
            };
        }
        // Get products in category
        const products = await productModule.listProducts(productFilters, {
            relations: ["variants", "variants.calculated_price"],
            take: 1000
        });
        let filteredProducts = products;
        // TODO: Apply facet filters when FacetAggregationService is ready
        // if (facet_filters) {
        //   const filters = JSON.parse(facet_filters)
        //   filteredProducts = await applyFacetFilters(products, filters)
        // }
        // Apply sorting
        filteredProducts = applySorting(filteredProducts, sortBy);
        // Pagination
        const totalProducts = filteredProducts.length;
        const totalPages = Math.ceil(totalProducts / itemsPerPage);
        const paginatedProducts = filteredProducts.slice(offset, offset + itemsPerPage);
        return res.json({
            pagination: {
                total: totalProducts,
                limit: itemsPerPage,
                offset,
                totalPages,
                currentPage
            },
            products: paginatedProducts
        });
    }
    catch (error) {
        console.error("Error fetching products for category:", error);
        return res.status(500).json({
            error: "Failed to fetch products",
            message: error instanceof Error ? error.message : "Unknown error"
        });
    }
}
function applySorting(products, sortBy) {
    switch (sortBy) {
        case 'price_asc':
            return products.sort((a, b) => {
                const priceA = a.variants?.[0]?.calculated_price?.amount || 0;
                const priceB = b.variants?.[0]?.calculated_price?.amount || 0;
                return priceA - priceB;
            });
        case 'price_desc':
            return products.sort((a, b) => {
                const priceA = a.variants?.[0]?.calculated_price?.amount || 0;
                const priceB = b.variants?.[0]?.calculated_price?.amount || 0;
                return priceB - priceA;
            });
        case 'newest':
            return products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        case 'name_asc':
            return products.sort((a, b) => a.title.localeCompare(b.title));
        case 'name_desc':
            return products.sort((a, b) => b.title.localeCompare(a.title));
        case 'popularity':
        default:
            return products;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2NhdGVnb3J5L1tpZF0vcHJvZHVjdHMvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxrQkFrRkM7QUFwRkQscURBQW1EO0FBRTVDLEtBQUssVUFBVSxHQUFHLENBQ3ZCLEdBQWtCLEVBQ2xCLEdBQW1CO0lBRW5CLE1BQU0sRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQTtJQUNyQyxNQUFNLEVBQ0osTUFBTSxHQUFHLFlBQVksRUFDckIsSUFBSSxHQUFHLEdBQUcsRUFDVixLQUFLLEdBQUcsSUFBSSxFQUNaLENBQUMsRUFDRixHQUFHLEdBQUcsQ0FBQyxLQUErQixDQUFBO0lBRXZDLG1CQUFtQjtJQUNuQixJQUFJLENBQUMsVUFBVSxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUM7UUFDOUUsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUMxQixLQUFLLEVBQUUsK0JBQStCO1NBQ3ZDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCx3QkFBd0I7SUFDeEIsTUFBTSxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFBO0lBRTdELE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFDdEMsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQTtJQUN4QyxNQUFNLE1BQU0sR0FBRyxDQUFDLFdBQVcsR0FBRyxDQUFD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