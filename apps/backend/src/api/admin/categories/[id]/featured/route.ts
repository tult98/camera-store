import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

function validateLandscapeImage(imageUrl: string) {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp']
  const hasValidExtension = validExtensions.some(ext => 
    imageUrl.toLowerCase().includes(ext)
  )
  
  if (!hasValidExtension) {
    throw new Error('Hero banner image must be a valid landscape image file (jpg, jpeg, png, webp)')
  }
}

export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const productService = req.scope.resolve(Modules.PRODUCT)
    const { id } = req.params
    const body = req.body as any
    const hero_image_url = body['hero_image_url']
    const is_featured = body['is_featured']
    const display_order = body['display_order']
    
    // Get current category
    const category = await productService.retrieveProductCategory(id)
    
    // Prepare metadata updates
    const updatedMetadata = { ...category.metadata }
    
    if (hero_image_url !== undefined) {
      if (hero_image_url) {
        validateLandscapeImage(hero_image_url)
        updatedMetadata['hero_image_url'] = hero_image_url
      } else {
        delete updatedMetadata['hero_image_url']
      }
    }
    
    if (is_featured !== undefined) {
      if (is_featured) {
        updatedMetadata['is_featured'] = true
      } else {
        updatedMetadata['is_featured'] = false
        delete updatedMetadata['hero_image_url']
        delete updatedMetadata['display_order']
      }
    }
    
    if (display_order !== undefined) {
      updatedMetadata['display_order'] = display_order
    }
    
    const updatedCategory = await productService.updateProductCategories(id, {
      metadata: updatedMetadata
    })
    
    res.json({
      category: updatedCategory,
      message: 'Category featured status updated successfully'
    })
  } catch (error) {
    console.error('Error updating category featured status:', error)
    res.status(500).json({
      error: (error as Error).message || 'Failed to update category featured status'
    })
  }
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const productService = req.scope.resolve(Modules.PRODUCT)
    const { id } = req.params
    
    const category = await productService.retrieveProductCategory(id)
    
    res.json({
      category_id: category.id,
      name: category.name,
      is_featured: category.metadata?.['is_featured'] || false,
      hero_image_url: category.metadata?.['hero_image_url'] || null,
      display_order: category.metadata?.['display_order'] || 0
    })
  } catch (error) {
    console.error('Error fetching category featured status:', error)
    res.status(500).json({
      error: 'Failed to fetch category featured status'
    })
  }
}