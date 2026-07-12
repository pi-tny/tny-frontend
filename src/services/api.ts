import axios, { AxiosError } from "axios";
import type {
  AdminImageCreate,
  AdminProductCreate,
  AdminProductUpdate,
  AdminVariantCreate,
  AdminVariantUpdate,
  Admin,
  AdminCreate,
  AdminUpdate,
  ApiImage,
  ApiVariant,
  Category,
  CategoryBody,
  CreateOrderBody,
  Lead,
  OrderDetail,
  OrderResponse,
  OrderStatus,
  OrderSummary,
  PaginationMeta,
  ProductDetail,
  ProductSummary,
} from "../types";

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000";

// admin token
const TOKEN_KEY = "tny_admin_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

const api = axios.create({
  baseURL: BASE_URL,
  // keep the old query behavior: skip params that are empty or false
  paramsSerializer: (params: Record<string, unknown>) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "" && value !== false) {
        search.set(key, String(value));
      }
    }
    return search.toString();
  },
});

// attach the bearer token to every request when we have one
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// drop the local session on 401 and surface the server's error message
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ error?: { message?: string } }>) => {
    if (error.response?.status === 401) clearToken();
    const message = error.response?.data?.error?.message ?? "Erro ao conectar com o servidor";
    return Promise.reject(new Error(message));
  },
);

// products
export interface ProductFilters {
  q?: string;
  category_id?: number;
  on_sale?: boolean;
  in_stock?: boolean;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "name";
  page?: number;
  limit?: number;
}

export async function getProducts(
  filters?: ProductFilters,
): Promise<{ data: ProductSummary[]; meta: PaginationMeta }> {
  const { data } = await api.get("/products", { params: filters });
  return data;
}

export async function getProductById(id: number): Promise<ProductDetail> {
  const { data } = await api.get<{ data: ProductDetail }>(`/products/${id}`);
  return data.data;
}

export async function getRelatedProducts(id: number, limit = 4): Promise<ProductSummary[]> {
  const { data } = await api.get<{ data: ProductSummary[] }>(`/products/${id}/related`, {
    params: { limit },
  });
  return data.data;
}

// categories
export async function getCategories(
  page = 1,
  limit = 50,
): Promise<{ data: Category[]; meta: PaginationMeta }> {
  const { data } = await api.get("/categories", { params: { page, limit } });
  return data;
}

// orders
export async function createOrder(body: CreateOrderBody): Promise<OrderResponse> {
  const { data } = await api.post<{ data: OrderResponse }>("/orders", body);
  return data.data;
}

// leads
export interface LeadBody {
  name: string;
  email: string;
  phone: string;
  marketing_consent?: boolean;
}

export async function subscribeLead(body: LeadBody): Promise<void> {
  await api.post("/leads", body);
}

// admin auth
export interface AdminProfile {
  id: number;
  name: string;
  email: string;
  active: boolean;
  created_at: string;
}

export async function adminLogin(email: string, password: string): Promise<string> {
  const { data } = await api.post<{ data: { token: string } }>("/admin/auth/login", { email, password });
  return data.data.token;
}

export async function adminMe(): Promise<AdminProfile> {
  const { data } = await api.get<{ data: AdminProfile }>("/admin/auth/me");
  return data.data;
}

export async function adminLogout(): Promise<void> {
  await api.post("/admin/auth/logout");
}

// admin: products
export interface AdminProductFilters extends ProductFilters {
  active?: boolean;
}

export async function adminListProducts(
  filters?: AdminProductFilters,
): Promise<{ data: ProductSummary[]; meta: PaginationMeta }> {
  const { data } = await api.get("/admin/products", { params: filters });
  return data;
}

export async function adminGetProduct(id: number): Promise<ProductDetail> {
  const { data } = await api.get<{ data: ProductDetail }>(`/admin/products/${id}`);
  return data.data;
}

export async function adminCreateProduct(body: AdminProductCreate): Promise<ProductDetail> {
  const { data } = await api.post<{ data: ProductDetail }>("/admin/products", body);
  return data.data;
}

export async function adminUpdateProduct(id: number, body: AdminProductUpdate): Promise<ProductDetail> {
  const { data } = await api.put<{ data: ProductDetail }>(`/admin/products/${id}`, body);
  return data.data;
}

export async function adminDeleteProduct(id: number): Promise<void> {
  await api.delete(`/admin/products/${id}`);
}

export async function adminSetProductCategories(id: number, categoryIds: number[]): Promise<Category[]> {
  const { data } = await api.put<{ data: Category[] }>(`/admin/products/${id}/categories`, {
    category_ids: categoryIds,
  });
  return data.data;
}

// admin: variants
export async function adminCreateVariant(productId: number, body: AdminVariantCreate): Promise<ApiVariant> {
  const { data } = await api.post<{ data: ApiVariant }>(`/admin/products/${productId}/variants`, body);
  return data.data;
}

export async function adminUpdateVariant(variantId: number, body: AdminVariantUpdate): Promise<ApiVariant> {
  const { data } = await api.put<{ data: ApiVariant }>(`/admin/variants/${variantId}`, body);
  return data.data;
}

export async function adminDeleteVariant(variantId: number): Promise<void> {
  await api.delete(`/admin/variants/${variantId}`);
}

// admin: images
export async function adminAddImage(productId: number, body: AdminImageCreate): Promise<ApiImage> {
  const { data } = await api.post<{ data: ApiImage }>(`/admin/products/${productId}/images`, body);
  return data.data;
}

export async function adminUpdateImage(
  imageId: number,
  body: { variant_id?: number | null; alt_text?: string | null; position?: number },
): Promise<ApiImage> {
  const { data } = await api.put<{ data: ApiImage }>(`/admin/images/${imageId}`, body);
  return data.data;
}

export async function adminDeleteImage(imageId: number): Promise<void> {
  await api.delete(`/admin/images/${imageId}`);
}

// admin: orders
export interface AdminOrderFilters {
  status?: OrderStatus;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

export async function adminListOrders(
  filters?: AdminOrderFilters,
): Promise<{ data: OrderSummary[]; meta: PaginationMeta }> {
  const { data } = await api.get("/admin/orders", { params: filters });
  return data;
}

export async function adminGetOrder(id: number): Promise<OrderDetail> {
  const { data } = await api.get<{ data: OrderDetail }>(`/admin/orders/${id}`);
  return data.data;
}

export async function adminUpdateOrderStatus(id: number, status: OrderStatus): Promise<OrderDetail> {
  const { data } = await api.patch<{ data: OrderDetail }>(`/admin/orders/${id}/status`, { status });
  return data.data;
}

// admin: categories
export async function adminListCategories(
  page = 1,
  limit = 100,
): Promise<{ data: Category[]; meta: PaginationMeta }> {
  const { data } = await api.get("/admin/categories", { params: { page, limit } });
  return data;
}

export async function adminCreateCategory(body: CategoryBody): Promise<Category> {
  const { data } = await api.post<{ data: Category }>("/admin/categories", body);
  return data.data;
}

export async function adminUpdateCategory(id: number, body: CategoryBody): Promise<Category> {
  const { data } = await api.put<{ data: Category }>(`/admin/categories/${id}`, body);
  return data.data;
}

export async function adminDeleteCategory(id: number): Promise<void> {
  await api.delete(`/admin/categories/${id}`);
}

// admin: leads
export async function adminListLeads(filters?: {
  q?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Lead[]; meta: PaginationMeta }> {
  const { data } = await api.get("/admin/leads", { params: filters });
  return data;
}

export async function adminDeleteLead(id: number): Promise<void> {
  await api.delete(`/admin/leads/${id}`);
}

// admin: admins
export async function adminListAdmins(): Promise<Admin[]> {
  const { data } = await api.get<{ data: Admin[] }>("/admin/admins");
  return data.data;
}

export async function adminCreateAdmin(body: AdminCreate): Promise<Admin> {
  const { data } = await api.post<{ data: Admin }>("/admin/admins", body);
  return data.data;
}

export async function adminUpdateAdmin(id: number, body: AdminUpdate): Promise<Admin> {
  const { data } = await api.put<{ data: Admin }>(`/admin/admins/${id}`, body);
  return data.data;
}

export async function adminDeleteAdmin(id: number): Promise<void> {
  await api.delete(`/admin/admins/${id}`);
}
