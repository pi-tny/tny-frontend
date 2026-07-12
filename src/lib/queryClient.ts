import { QueryClient } from "@tanstack/react-query";

// single shared client. storefront data changes rarely, so we keep a small
// stale window to avoid refetching on every mount/focus.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
