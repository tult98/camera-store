import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listCategories = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  const limit = query?.['limit'] || 100

  return sdk.client
    .fetch<{ product_categories: HttpTypes.StoreProductCategory[] }>(
      "/store/product-categories",
      {
        query: {
          fields:
            "*category_children, *products, *parent_category, *parent_category.parent_category",
          limit,
          ...query,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories)
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  const next = {
    ...(await getCacheOptions("categories")),
  }

  return sdk.client
    .fetch<HttpTypes.StoreProductCategoryListResponse>(
      `/store/product-categories`,
      {
        query: {
          fields: "*category_children, *products",
          handle,
        },
        next,
        cache: "force-cache",
      }
    )
    .then(({ product_categories }) => product_categories[0])
}

export const getCategoriesForNavigation = async () => {
  const categories = await listCategories({ 
    fields: "*category_children, *parent_category",
    limit: 100
  })

  if (!categories) {
    return []
  }

  // Get only top-level categories (those without parents)
  const topLevelCategories = categories.filter(category => !category.parent_category)

  // Transform to navigation format
  return topLevelCategories.map(category => ({
    id: category.id,
    title: category.name,
    href: `/categories/${category.handle}`,
    handle: category.handle,
    dropdown: category.category_children?.length > 0 
      ? category.category_children.map(child => ({
          id: child.id,
          title: child.name,
          href: `/categories/${child.handle}`,
          handle: child.handle
        }))
      : undefined
  }))
}
