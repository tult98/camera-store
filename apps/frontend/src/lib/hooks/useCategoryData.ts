import {
  CategoryFacetsRequest,
  CategoryFacetsResponse,
  CategoryProductsRequest,
  CategoryProductsResponse
} from "@camera-store/shared-types"
import { cameraStoreApi } from "@lib/config"
import { useQuery } from "@tanstack/react-query"

export const useCategoryProducts = (request: CategoryProductsRequest) => {
  return useQuery<CategoryProductsResponse>({
    queryKey: ["categoryProducts", request],
    queryFn: async () => {
      const response = await cameraStoreApi<{ data: CategoryProductsResponse }>(
        "/store/category-products",
        {
          method: "POST",
          body: request,
        }
      )
      return response.data
    },
    enabled: !!request.category_id,
  })
}

export const useCategoryFacets = (request: CategoryFacetsRequest) => {
  return useQuery<CategoryFacetsResponse>({
    queryKey: ["categoryFacets", request],
    queryFn: async () => {
      const response = await cameraStoreApi<{ data: CategoryFacetsResponse }>(
        "/store/category-facets",
        {
          method: "POST",
          body: request,
        }
      )
      return response.data
    },
    enabled: !!request.category_id,
  })
}

// export const useCategoryDataWithInitial = (
//   request: CategoryProductsRequest,
//   initialProductsData?: CategoryProductsResponse,
//   initialFacetsData?: CategoryFacetsResponse
// ) => {
//   const productsQuery = useQuery<CategoryProductsResponse>({
//     queryKey: ["categoryProducts", request],
//     queryFn: async () => {
//       const response = await cameraStoreApi.post(
//         "/store/category-products",
//         request
//       )
//       return response.data
//     },
//     initialData: initialProductsData,
//     enabled: !!request.category_id,
//   })

//   const facetsQuery = useQuery<CategoryFacetsResponse>({
//     queryKey: [
//       "categoryFacets",
//       { category_id: request.category_id, filters: request.filters },
//     ],
//     queryFn: async () => {
//       const response = await cameraStoreApi.post("/store/category-facets", {
//         category_id: request.category_id,
//         filters: request.filters,
//       })
//       return response.data
//     },
//     initialData: initialFacetsData,
//     enabled: !!request.category_id,
//   })

//   return {
//     productsQuery,
//     facetsQuery,
//     isLoading: productsQuery.isLoading || facetsQuery.isLoading,
//     isError: productsQuery.isError || facetsQuery.isError,
//     refetchAll: async () => {
//       await Promise.all([productsQuery.refetch(), facetsQuery.refetch()])
//     },
//   }
// }
