"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategoryIds = getAllCategoryIds;
exports.resolveQueryInstance = resolveQueryInstance;
const utils_1 = require("@medusajs/framework/utils");
/**
 * Get all category IDs including child categories recursively
 * Used for hierarchical product queries to include products from subcategories
 */
async function getAllCategoryIds(query, categoryId) {
    try {
        // Get the main category and all its children recursively (up to 5 levels deep)
        // This balances performance with completeness for most e-commerce category structures
        const result = await query.graph({
            entity: "product_category",
            fields: [
                "id",
                "category_children.id",
                "category_children.category_children.id",
                "category_children.category_children.category_children.id",
                "category_children.category_children.category_children.category_children.id",
            ],
            filters: { id: categoryId },
        });
        const category = result.data?.[0];
        if (!category) {
            return [categoryId]; // Return original category if not found
        }
        const categoryIds = new Set([categoryId]); // Use Set to prevent duplicates
        const MAX_CATEGORIES = 1000; // Safety limit to prevent memory issues
        // Recursively collect all child category IDs with depth tracking
        function collectChildIds(cat, depth = 0) {
            // Safety checks: max depth and max categories
            if (depth > 10 || categoryIds.size >= MAX_CATEGORIES) {
                return;
            }
            if (cat.category_children && cat.category_children.length > 0) {
                cat.category_children.forEach((child) => {
                    if (child.id && !categoryIds.has(child.id)) {
                        categoryIds.add(child.id);
                        collectChildIds(child, depth + 1); // Track depth to prevent infinite loops
                    }
                });
            }
        }
        collectChildIds(category);
        return Array.from(categoryIds);
    }
    catch {
        // Fallback to original category on error
        return [categoryId];
    }
}
/**
 * Resolve query instance from container with proper typing
 */
function resolveQueryInstance(container) {
    return container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2F0ZWdvcnktaGllcmFyY2h5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL3V0aWxzL2NhdGVnb3J5LWhpZXJhcmNoeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQThCQSw4Q0FrREM7QUFLRCxvREFFQztBQXZGRCxxREFBc0U7QUEwQnRFOzs7R0FHRztBQUNJLEtBQUssVUFBVSxpQkFBaUIsQ0FDckMsS0FBb0IsRUFDcEIsVUFBa0I7SUFFbEIsSUFBSSxDQUFDO1FBQ0gsK0VBQStFO1FBQy9FLHNGQUFzRjtRQUN0RixNQUFNLE1BQU0sR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDL0IsTUFBTSxFQUFFLGtCQUFrQjtZQUMxQixNQUFNLEVBQUU7Z0JBQ04sSUFBSTtnQkFDSixzQkFBc0I7Z0JBQ3RCLHdDQUF3QztnQkFDeEMsMERBQTBEO2dCQUMxRCw0RUFBNEU7YUFDN0U7WUFDRCxPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFO1NBQzVCLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDZCxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyx3Q0FBd0M7UUFDL0QsQ0FBQztRQUVELE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLGdDQUFnQztRQUMzRSxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsQ0FBQyx3Q0FBd0M7UUFFckUsaUVBQWlFO1FBQ2pFLFNBQVMsZUFBZSxDQUFDLEdBQW9CLEVBQUUsS0FBSyxHQUFHLENBQUM7WUFDdEQsOENBQThDO1lBQzlDLElBQUksS0FBSyxHQUFHLEVBQUUsSUFBSSxXQUFXLENBQUMsSUFBSSxJQUFJLGNBQWMsRUFBRSxDQUFDO2dCQUNyRCxPQUFPO1lBQ1QsQ0FBQztZQUVELElBQUksR0FBRyxDQUFDLGlCQUFpQixJQUFJLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7Z0JBQzlELEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFzQixFQUFFLEVBQUU7b0JBQ3ZELElBQUksS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7d0JBQzNDLFdBQVcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO3dCQUMxQixlQUFlLENBQUMsS0FBSyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLHdDQUF3QztvQkFDN0UsQ0FBQztnQkFDSCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUM7UUFDSCxDQUFDO1FBRUQsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzFCLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBQUMsTUFBTSxDQUFDO1FBQ1AseUNBQXlDO1FBQ3pDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0QixDQUFDO0FBQ0gsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0Isb0JBQW9CLENBQUMsU0FBYztJQUNqRCxPQUFPLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsS0FBSyxDQUFrQixDQUFDO0FBQzdFLENBQUMifQ==