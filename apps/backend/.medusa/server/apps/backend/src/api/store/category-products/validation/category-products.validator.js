"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryProductsValidator = exports.CategoryProductsSchema = void 0;
const zod_1 = require("zod");
exports.CategoryProductsSchema = zod_1.z
    .object({
    category_id: zod_1.z.string().min(1, "category_id is required").max(100),
    page: zod_1.z.number().int().positive().default(1),
    page_size: zod_1.z.number().int().positive().max(100).default(24),
    order_by: zod_1.z.string().max(100).default("-created_at"),
    filters: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional().default({}),
    search_query: zod_1.z.string().max(100).optional(),
})
    .refine((data) => {
    if (data.filters) {
        const filterCount = Object.keys(data.filters).length;
        if (filterCount > 20)
            return false;
        if (data.filters["price"]) {
            if (typeof data.filters["price"] !== "object")
                return false;
            const price = data.filters["price"];
            if (price.min !== undefined &&
                (typeof price.min !== "number" || price.min < 0))
                return false;
            if (price.max !== undefined &&
                (typeof price.max !== "number" || price.max < 0))
                return false;
            if (price.min !== undefined &&
                price.max !== undefined &&
                price.min > price.max)
                return false;
        }
        for (const [key, value] of Object.entries(data.filters)) {
            if (key === "price")
                continue;
            if (Array.isArray(value)) {
                if (value.length > 100)
                    return false;
                if (!value.every((v) => typeof v === "string" && v.length < 200))
                    return false;
            }
        }
    }
    return true;
}, {
    message: "Invalid filter structure or values",
});
class CategoryProductsValidator {
    static validateCategoryId(category_id) {
        if (!category_id ||
            typeof category_id !== "string" ||
            category_id.trim() === "") {
            throw new Error("Valid category_id is required");
        }
        return category_id.trim();
    }
    static validateHeaders(headers) {
        const region_id = headers["region_id"];
        const currency_code = headers["currency_code"];
        if (!region_id || !currency_code) {
            throw new Error("region_id and currency_code headers are required");
        }
        return { region_id, currency_code };
    }
    static validatePaginationParams(page, page_size) {
        const currentPage = Math.max(1, Number(page) || 1);
        const itemsPerPage = Math.min(Math.max(1, Number(page_size) || 24), 100);
        const offset = (currentPage - 1) * itemsPerPage;
        return { currentPage, itemsPerPage, offset };
    }
    static validateCategoryIds(categoryIds) {
        if (!categoryIds ||
            categoryIds.length === 0 ||
            categoryIds.some((id) => !id || typeof id !== "string")) {
            throw new Error("Category not found or invalid");
        }
    }
    static sanitizeSearchQuery(searchQuery) {
        if (!searchQuery || searchQuery.trim() === "") {
            return undefined;
        }
        const sanitized = searchQuery
            .toLowerCase()
            .trim()
            .replace(/[<>"'&]/g, '')
            .substring(0, 100);
        return sanitized.length === 0 ? undefined : sanitized;
    }
}
exports.CategoryProductsValidator = CategoryProductsValidator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2F0ZWdvcnktcHJvZHVjdHMudmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2FwaS9zdG9yZS9jYXRlZ29yeS1wcm9kdWN0cy92YWxpZGF0aW9uL2NhdGVnb3J5LXByb2R1Y3RzLnZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBd0I7QUFHWCxRQUFBLHNCQUFzQixHQUFHLE9BQUM7S0FDcEMsTUFBTSxDQUFDO0lBQ04sV0FBVyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLHlCQUF5QixDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztJQUNsRSxJQUFJLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDNUMsU0FBUyxFQUFFLE9BQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztJQUMzRCxRQUFRLEVBQUUsT0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO0lBQ3BELE9BQU8sRUFBRSxPQUFDLENBQUMsTUFBTSxDQUFDLE9BQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxPQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO0lBQzdELFlBQVksRUFBRSxPQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRTtDQUM3QyxDQUFDO0tBQ0QsTUFBTSxDQUNMLENBQUMsSUFBSSxFQUFFLEVB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