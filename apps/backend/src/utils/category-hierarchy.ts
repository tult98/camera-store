import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

interface ProductCategory {
  id: string;
  category_children?: ProductCategory[];
}

interface QueryGraphResult {
  data?: ProductCategory[];
  metadata?: { count: number };
}

interface QueryInstance {
  graph: (config: {
    entity: string;
    fields: string[];
    filters: Record<string, any>;
    pagination?: {
      skip: number;
      take: number;
      order: Record<string, any>;
    };
    context?: Record<string, any>;
  }) => Promise<QueryGraphResult>;
}

/**
 * Get all category IDs including child categories recursively
 * Used for hierarchical product queries to include products from subcategories
 */
export async function getAllCategoryIds(
  query: QueryInstance,
  categoryId: string
): Promise<string[]> {
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
    function collectChildIds(cat: ProductCategory, depth = 0): void {
      // Safety checks: max depth and max categories
      if (depth > 10 || categoryIds.size >= MAX_CATEGORIES) {
        return;
      }
      
      if (cat.category_children && cat.category_children.length > 0) {
        cat.category_children.forEach((child: ProductCategory) => {
          if (child.id && !categoryIds.has(child.id)) {
            categoryIds.add(child.id);
            collectChildIds(child, depth + 1); // Track depth to prevent infinite loops
          }
        });
      }
    }

    collectChildIds(category);
    return Array.from(categoryIds);
  } catch {
    // Fallback to original category on error
    return [categoryId];
  }
}

/**
 * Resolve query instance from container with proper typing
 */
export function resolveQueryInstance(container: any): QueryInstance {
  return container.resolve(ContainerRegistrationKeys.QUERY) as QueryInstance;
}