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
  allStoreCategories: ["categories", "all"] as const,
  me: ["auth", "me"] as const,
  admin: {
    products: (filters?: AdminProductFilters) => ["admin", "products", filters ?? {}] as const,
    product: (id: number) => ["admin", "product", id] as const,
    orders: (filters?: AdminOrderFilters) => ["admin", "orders", filters ?? {}] as const,
    order: (id: number) => ["admin", "order", id] as const,
    categories: ["admin", "categories"] as const,
    allCategories: ["admin", "categories", "all"] as const,
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
  return useQuery({ queryKey: keys.categories, queryFn: () => getCategories() });
}

// storefront counterpart of useAllCategories: pages the public endpoint to load
// every category, so the /produtos combobox can search the full list.
export function useAllStoreCategories() {
  return useQuery({
    queryKey: keys.allStoreCategories,
    queryFn: async () => {
      const LIMIT = 100;
      const first = await getCategories(1, LIMIT);
      let all = first.data;
      for (let page = 2; page <= first.meta.total_pages; page++) {
        const next = await getCategories(page, LIMIT);
        all = all.concat(next.data);
      }
      return all;
    },
  });
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

// loads every category by paging through the admin endpoint (limit caps at 100),
// so client-side search/filter can work over the full list.
export function useAllCategories() {
  return useQuery({
    queryKey: keys.admin.allCategories,
    queryFn: async () => {
      const LIMIT = 100;
      const first = await adminListCategories(1, LIMIT);
      let all = first.data;
      for (let page = 2; page <= first.meta.total_pages; page++) {
        const next = await adminListCategories(page, LIMIT);
        all = all.concat(next.data);
      }
      return all;
    },
  });
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
