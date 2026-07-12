import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getProducts,
  getProductById,
  getRelatedProducts,
  getCategories,
  adminListProducts,
  adminGetProduct,
  adminListOrders,
  adminGetOrder,
  adminListCategories,
  adminListLeads,
  adminListAdmins,
  type ProductFilters,
  type AdminProductFilters,
  type AdminOrderFilters,
} from "../services/api";

// central place for query keys. list keys share a prefix so mutations can
// invalidate a whole domain regardless of the active filters.
export const keys = {
  products: (filters?: ProductFilters) => ["products", filters ?? {}] as const,
  product: (id: number) => ["product", id] as const,
  related: (id: number) => ["product", id, "related"] as const,
  categories: ["categories"] as const,
  me: ["auth", "me"] as const,
  admin: {
    products: (filters?: AdminProductFilters) => ["admin", "products", filters ?? {}] as const,
    product: (id: number) => ["admin", "product", id] as const,
    orders: (filters?: AdminOrderFilters) => ["admin", "orders", filters ?? {}] as const,
    order: (id: number) => ["admin", "order", id] as const,
    categories: ["admin", "categories"] as const,
    leads: (q?: string) => ["admin", "leads", q ?? ""] as const,
    admins: ["admin", "admins"] as const,
  },
};

// storefront
export function useProducts(filters?: ProductFilters) {
  return useQuery({ queryKey: keys.products(filters), queryFn: () => getProducts(filters) });
}

export function useInfiniteProducts(filters?: Omit<ProductFilters, "page">) {
  return useInfiniteQuery({
    queryKey: keys.products(filters),
    queryFn: ({ pageParam }) => getProducts({ ...filters, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.meta.page < last.meta.total_pages ? last.meta.page + 1 : undefined),
  });
}

export function useProduct(id: number | undefined) {
  return useQuery({
    queryKey: keys.product(id ?? 0),
    queryFn: () => getProductById(id!),
    enabled: id != null,
  });
}

export function useRelatedProducts(id: number | undefined) {
  return useQuery({
    queryKey: keys.related(id ?? 0),
    queryFn: () => getRelatedProducts(id!),
    enabled: id != null,
  });
}

export function useCategories() {
  return useQuery({ queryKey: keys.categories, queryFn: getCategories });
}

// admin
export function useAdminProducts(filters?: AdminProductFilters) {
  return useQuery({ queryKey: keys.admin.products(filters), queryFn: () => adminListProducts(filters) });
}

export function useAdminProduct(id: number | undefined) {
  return useQuery({
    queryKey: keys.admin.product(id ?? 0),
    queryFn: () => adminGetProduct(id!),
    enabled: id != null,
  });
}

export function useAdminOrders(filters?: AdminOrderFilters) {
  return useQuery({ queryKey: keys.admin.orders(filters), queryFn: () => adminListOrders(filters) });
}

export function useAdminOrder(id: number) {
  return useQuery({ queryKey: keys.admin.order(id), queryFn: () => adminGetOrder(id) });
}

export function useAdminCategories() {
  return useQuery({ queryKey: keys.admin.categories, queryFn: () => adminListCategories() });
}

export function useAdminLeads(q: string, page: number, limit: number) {
  return useQuery({
    queryKey: [...keys.admin.leads(q), page, limit],
    queryFn: () => adminListLeads({ q: q || undefined, page, limit }),
  });
}

export function useAdminAdmins() {
  return useQuery({ queryKey: keys.admin.admins, queryFn: adminListAdmins });
}
