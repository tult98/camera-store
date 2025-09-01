import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ComponentType } from "react";

// Create a QueryClient instance with optimized defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// HOC to wrap components with QueryClientProvider
export function withQueryClientProvider<P extends object>(
  Component: ComponentType<P>
): ComponentType<P> {
  const WrappedComponent = (props: P) => {
    return (
      <QueryClientProvider client={queryClient}>
        <Component {...props} />
      </QueryClientProvider>
    );
  };

  // Preserve component name for debugging
  WrappedComponent.displayName = `withQueryClientProvider(${Component.displayName || Component.name})`;

  return WrappedComponent;
}