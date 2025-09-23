"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUT = PUT;
exports.GET = GET;
const utils_1 = require("@medusajs/framework/utils");
function validateLandscapeImage(imageUrl) {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const hasValidExtension = validExtensions.some(ext => imageUrl.toLowerCase().includes(ext));
    if (!hasValidExtension) {
        throw new Error('Hero banner image must be a valid landscape image file (jpg, jpeg, png, webp)');
    }
}
async function PUT(req, res) {
    try {
        const productService = req.scope.resolve(utils_1.Modules.PRODUCT);
        const { id } = req.params;
        const body = req.body;
        const hero_image_url = body['hero_image_url'];
        const is_featured = body['is_featured'];
        const display_order = body['display_order'];
        // Get current category
        const category = await productService.retrieveProductCategory(id);
        // Prepare metadata updates
        const updatedMetadata = { ...category.metadata };
        if (hero_image_url !== undefined) {
            if (hero_image_url) {
                validateLandscapeImage(hero_image_url);
                updatedMetadata['hero_image_url'] = hero_image_url;
            }
            else {
                delete updatedMetadata['hero_image_url'];
            }
        }
        if (is_featured !== undefined) {
            if (is_featured) {
                updatedMetadata['is_featured'] = true;
            }
            else {
                updatedMetadata['is_featured'] = false;
                delete updatedMetadata['hero_image_url'];
                delete updatedMetadata['display_order'];
            }
        }
        if (display_order !== undefined) {
            updatedMetadata['display_order'] = display_order;
        }
        const updatedCategory = await productService.updateProductCategories(id, {
            metadata: updatedMetadata
        });
        res.json({
            category: updatedCategory,
            message: 'Category featured status updated successfully'
        });
    }
    catch (error) {
        console.error('Error updating category featured status:', error);
        res.status(500).json({
            error: error.message || 'Failed to update category featured status'
        });
    }
}
async function GET(req, res) {
    try {
        const productService = req.scope.resolve(utils_1.Modules.PRODUCT);
        const { id } = req.params;
        const category = await productService.retrieveProductCategory(id);
        res.json({
            category_id: category.id,
            name: category.name,
            is_featured: category.metadata?.['is_featured'] || false,
            hero_image_url: category.metadata?.['hero_image_url'] || null,
            display_order: category.metadata?.['display_order'] || 0
        });
    }
    catch (error) {
        console.error('Error fetching category featured status:', error);
        res.status(500).json({
            error: 'Failed to fetch category featured status'
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2NhdGVnb3JpZXMvW2lkXS9mZWF0dXJlZC9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQWNBLGtCQXVEQztBQUVELGtCQXVCQztBQTdGRCxxREFBbUQ7QUFFbkQsU0FBUyxzQkFBc0IsQ0FBQyxRQUFnQjtJQUM5QyxNQUFNLGVBQWUsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQzFELE1BQU0saUJBQWlCLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUNuRCxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUNyQyxDQUFBO0lBRUQsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQywrRUFBK0UsQ0FBQyxDQUFBO0lBQ2xHLENBQUM7QUFDSCxDQUFDO0FBRU0sS0FBSyxVQUFVLEdBQUcsQ0FDdkIsR0FBa0IsRUFDbEIsR0FBbUI7SUFFbkIsSUFBSSxDQUFDO1FBQ0gsTUFBTSxjQUFjLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ3pELE1BQU0sRUFBRSxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFBO1FBQ3pCLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFXLENBQUE7UUFDNUIsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUE7UUFDN0MsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO1FBQ3ZDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtRQUUzQyx1QkFBdUI7UUFD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