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

// ─── Token (admin) ────────────────────────────────────────────────────────────

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

interface RequestOptions extends RequestInit {
  /** Injeta o Bearer token e limpa a sessão em caso de 401. */
  auth?: boolean;
}

async function request<T>(path: string, options?: RequestOptions): Promise<T> {
  const { auth, headers, ...rest } = options ?? {};

  const authHeaders: Record<string, string> = {};
  if (auth) {
    const token = getToken();
    if (token) authHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...authHeaders, ...headers },
    ...rest,
  });

  // Token inválido/expirado: encerra a sessão local.
  if (auth && res.status === 401) clearToken();

  // Suporta respostas sem corpo (204 No Content).
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(json?.error?.message ?? "Erro ao conectar com o servidor");
  return json as T;
}

// ─── Products ───────────────────────────────────────────────────────────────

export interface ProductFilters {
  q?: string;
  category_id?: number;
  on_sale?: boolean;
  in_stock?: boolean;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc" | "name";
  page?: number;
  limit?: number;
}

function buildQuery(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return "";
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "" && value !== false) q.set(key, String(value));
  }
  const str = q.toString();
  return str ? `?${str}` : "";
}

export async function getProducts(
  filters?: ProductFilters,
): Promise<{ data: ProductSummary[]; meta: PaginationMeta }> {
  return request(`/products${buildQuery(filters as Record<string, string | number | boolean | undefined>)}`);
}

export async function getProductById(id: number): Promise<ProductDetail> {
  const res = await request<{ data: ProductDetail }>(`/products/${id}`);
  return res.data;
}

export async function getRelatedProducts(id: number, limit = 4): Promise<ProductSummary[]> {
  const res = await request<{ data: ProductSummary[] }>(`/products/${id}/related?limit=${limit}`);
  return res.data;
}

// ─── Categories ─────────────────────────────────────────────────────────────

export async function getCategories(): Promise<{ data: Category[]; meta: PaginationMeta }> {
  return request("/categories?limit=50");
}

// ─── Orders ─────────────────────────────────────────────────────────────────

export async function createOrder(body: CreateOrderBody): Promise<OrderResponse> {
  const res = await request<{ data: OrderResponse }>("/orders", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res.data;
}

// ─── Leads ──────────────────────────────────────────────────────────────────

export interface LeadBody {
  name: string;
  email: string;
  phone: string;
  marketing_consent?: boolean;
}

export async function subscribeLead(body: LeadBody): Promise<void> {
  await request("/leads", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ─── Admin Auth ──────────────────────────────────────────────────────────────

export interface AdminProfile {
  id: number;
  name: string;
  email: string;
  active: boolean;
  created_at: string;
}

export async function adminLogin(email: string, password: string): Promise<string> {
  const res = await request<{ data: { token: string } }>("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return res.data.token;
}

export async function adminMe(): Promise<AdminProfile> {
  const res = await request<{ data: AdminProfile }>("/admin/auth/me", { auth: true });
  return res.data;
}

export async function adminLogout(): Promise<void> {
  await request("/admin/auth/logout", { method: "POST", auth: true });
}

// ─── Admin: Products ──────────────────────────────────────────────────────────

export interface AdminProductFilters extends ProductFilters {
  active?: boolean;
}

export async function adminListProducts(
  filters?: AdminProductFilters,
): Promise<{ data: ProductSummary[]; meta: PaginationMeta }> {
  return request(
    `/admin/products${buildQuery(filters as Record<string, string | number | boolean | undefined>)}`,
    { auth: true },
  );
}

export async function adminGetProduct(id: number): Promise<ProductDetail> {
  const res = await request<{ data: ProductDetail }>(`/admin/products/${id}`, { auth: true });
  return res.data;
}

export async function adminCreateProduct(body: AdminProductCreate): Promise<ProductDetail> {
  const res = await request<{ data: ProductDetail }>("/admin/products", {
    method: "POST",
    auth: true,
    body: JSON.stringify(body),
  });
  return res.data;
}

export async function adminUpdateProduct(id: number, body: AdminProductUpdate): Promise<ProductDetail> {
  const res = await request<{ data: ProductDetail }>(`/admin/products/${id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(body),
  });
  return res.data;
}

export async function adminDeleteProduct(id: number): Promise<void> {
  await request(`/admin/products/${id}`, { method: "DELETE", auth: true });
}

export async function adminSetProductCategories(id: number, categoryIds: number[]): Promise<Category[]> {
  const res = await request<{ data: Category[] }>(`/admin/products/${id}/categories`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify({ category_ids: categoryIds }),
  });
  return res.data;
}

// ─── Admin: Variants ──────────────────────────────────────────────────────────

export async function adminCreateVariant(productId: number, body: AdminVariantCreate): Promise<ApiVariant> {
  const res = await request<{ data: ApiVariant }>(`/admin/products/${productId}/variants`, {
    method: "POST",
    auth: true,
    body: JSON.stringify(body),
  });
  return res.data;
}

export async function adminUpdateVariant(variantId: number, body: AdminVariantUpdate): Promise<ApiVariant> {
  const res = await request<{ data: ApiVariant }>(`/admin/variants/${variantId}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(body),
  });
  return res.data;
}

export async function adminDeleteVariant(variantId: number): Promise<void> {
  await request(`/admin/variants/${variantId}`, { method: "DELETE", auth: true });
}

// ─── Admin: Images ────────────────────────────────────────────────────────────

export async function adminAddImage(productId: number, body: AdminImageCreate): Promise<ApiImage> {
  const res = await request<{ data: ApiImage }>(`/admin/products/${productId}/images`, {
    method: "POST",
    auth: true,
    body: JSON.stringify(body),
  });
  return res.data;
}

export async function adminUpdateImage(
  imageId: number,
  body: { variant_id?: number | null; alt_text?: string | null; position?: number },
): Promise<ApiImage> {
  const res = await request<{ data: ApiImage }>(`/admin/images/${imageId}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(body),
  });
  return res.data;
}

export async function adminDeleteImage(imageId: number): Promise<void> {
  await request(`/admin/images/${imageId}`, { method: "DELETE", auth: true });
}

// ─── Admin: Orders ────────────────────────────────────────────────────────────

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
  return request(
    `/admin/orders${buildQuery(filters as Record<string, string | number | boolean | undefined>)}`,
    { auth: true },
  );
}

export async function adminGetOrder(id: number): Promise<OrderDetail> {
  const res = await request<{ data: OrderDetail }>(`/admin/orders/${id}`, { auth: true });
  return res.data;
}

export async function adminUpdateOrderStatus(id: number, status: OrderStatus): Promise<OrderDetail> {
  const res = await request<{ data: OrderDetail }>(`/admin/orders/${id}/status`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ status }),
  });
  return res.data;
}

// ─── Admin: Categories ────────────────────────────────────────────────────────

export async function adminListCategories(
  page = 1,
  limit = 100,
): Promise<{ data: Category[]; meta: PaginationMeta }> {
  return request(`/admin/categories?page=${page}&limit=${limit}`, { auth: true });
}

export async function adminCreateCategory(body: CategoryBody): Promise<Category> {
  const res = await request<{ data: Category }>("/admin/categories", {
    method: "POST",
    auth: true,
    body: JSON.stringify(body),
  });
  return res.data;
}

export async function adminUpdateCategory(id: number, body: CategoryBody): Promise<Category> {
  const res = await request<{ data: Category }>(`/admin/categories/${id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(body),
  });
  return res.data;
}

export async function adminDeleteCategory(id: number): Promise<void> {
  await request(`/admin/categories/${id}`, { method: "DELETE", auth: true });
}

// ─── Admin: Leads ─────────────────────────────────────────────────────────────

export async function adminListLeads(filters?: {
  q?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: Lead[]; meta: PaginationMeta }> {
  return request(
    `/admin/leads${buildQuery(filters as Record<string, string | number | boolean | undefined>)}`,
    { auth: true },
  );
}

export async function adminDeleteLead(id: number): Promise<void> {
  await request(`/admin/leads/${id}`, { method: "DELETE", auth: true });
}

// ─── Admin: Admins ────────────────────────────────────────────────────────────

export async function adminListAdmins(): Promise<Admin[]> {
  const res = await request<{ data: Admin[] }>("/admin/admins", { auth: true });
  return res.data;
}

export async function adminCreateAdmin(body: AdminCreate): Promise<Admin> {
  const res = await request<{ data: Admin }>("/admin/admins", {
    method: "POST",
    auth: true,
    body: JSON.stringify(body),
  });
  return res.data;
}

export async function adminUpdateAdmin(id: number, body: AdminUpdate): Promise<Admin> {
  const res = await request<{ data: Admin }>(`/admin/admins/${id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(body),
  });
  return res.data;
}

export async function adminDeleteAdmin(id: number): Promise<void> {
  await request(`/admin/admins/${id}`, { method: "DELETE", auth: true });
}
