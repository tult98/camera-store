import {
  ContainerRegistrationKeys,
  MedusaError,
} from '@medusajs/framework/utils';

interface ProductCategory {
  id: string;
  category_children?: ProductCategory[];
}

interface QueryGraphResult {
  data?: ProductCategory[];
  metadata?: { count: number };
}

export interface QueryInstance {
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
  // Get the main category and all its children recursively (up to 5 levels deep)
  // This balances performance with completeness for most e-commerce category structures
  const result = await query.graph({
    entity: 'product_category',
    fields: [
      'id',
      'category_children.id',
      // NOTE: Cannot query deeper by category_children.category_children...
    ],
    filters: { id: categoryId },
  });

  if (!result?.data?.length) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, 'Category not found');
  }

  const category = result.data[0];

  const categoryIds = new Set([category.id]); // Use Set to prevent duplicates
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
}

/**
 * Resolve query instance from container with proper typing
 */
export function resolveQueryInstance(container: any): QueryInstance {
  return container.resolve(ContainerRegistrationKeys.QUERY) as QueryInstance;
}
