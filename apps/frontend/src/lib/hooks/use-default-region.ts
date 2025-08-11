import { useRegion } from "@lib/context/region-context"

/**
 * Hook to get the default region for single-region store
 * Returns the region, loading state, and error
 */
export function useDefaultRegion() {
  const { region, isLoading, error } = useRegion()
  
  return {
    defaultRegion: region,
    isLoading,
    error,
  }
}