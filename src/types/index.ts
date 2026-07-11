// ─── Internal frontend types ────────────────────────────────────────────────

/** Payload mínimo aceito por `addToCart` (ver CarrinhoContext). */
export interface Produto {
  id: number;
  name: string;
  price: number;
  promotional_price?: number | null;
  image: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
  variantId?: number;
}

// ─── Backend API types ───────────────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  description?: string | null;
}

export interface ApiVariant {
  id: number;
  product_id: number;
  variant_sku: string;
  color: string;
  size: string;
  quantity: number;
  price: number | null;
  final_price: number;
}

export interface ApiImage {
  id: number;
  product_id: number;
  variant_id: number | null;
  url: string;
  alt_text: string | null;
  position: number;
}

export interface ProductSummary {
  id: number;
  sku: string;
  name: string;
  price: number;
  promotional_price: number | null;
  active: boolean;
  cover_image: string | null;
  categories: Category[];
}

export interface ProductDetail extends ProductSummary {
  description: string;
  created_at: string;
  variants: ApiVariant[];
  images: ApiImage[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface OrderItem {
  variant_id: number;
  quantity: number;
}

export interface CreateOrderBody {
  name: string;
  phone: string;
  email?: string;
  payment_method?: string;
  message?: string;
  items: OrderItem[];
}

export interface OrderResponse {
  id: number;
  total: number;
  status: string;
  created_at: string;
  whatsapp_url: string;
  whatsapp_message: string;
}

// ─── Admin: Leads & Admins ────────────────────────────────────────────────────

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  marketing_consent: boolean;
  consent_date: string;
  created_at: string;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  active: boolean;
  created_at: string;
}

export interface AdminCreate {
  name: string;
  email: string;
  password: string;
}

export interface AdminUpdate {
  name?: string;
  email?: string;
  password?: string;
  active?: boolean;
}

export interface CategoryBody {
  name: string;
  description?: string | null;
}

// ─── Admin: Orders ────────────────────────────────────────────────────────────

/** Status acionáveis (o backend só aceita estes no PATCH/filtro). */
export type OrderStatus = "new" | "fulfilled" | "ignored";

export interface OrderSummary {
  id: number;
  name: string;
  phone: string;
  total: number;
  // Resposta serializa como string livre; o banco pode conter valores legados
  // (ex.: "processing", "cancelled") além dos status acionáveis.
  status: string;
  created_at: string;
}

export interface AdminOrderItem {
  id: number;
  variant_id: number;
  product_name: string;
  color: string;
  size: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface OrderDetail extends OrderSummary {
  email: string | null;
  payment_method: string;
  message: string | null;
  notes: string | null;
  items: AdminOrderItem[];
}

// ─── Admin request bodies ─────────────────────────────────────────────────────

export interface AdminProductCreate {
  sku: string;
  name: string;
  description: string;
  price: number;
  promotional_price?: number | null;
  active?: boolean;
  category_ids?: number[];
}

export type AdminProductUpdate = Partial<AdminProductCreate>;

export interface AdminVariantCreate {
  variant_sku: string;
  color: string;
  size: string;
  quantity: number;
  price?: number | null;
}

export type AdminVariantUpdate = Partial<AdminVariantCreate>;

export interface AdminImageCreate {
  url: string;
  variant_id?: number | null;
  alt_text?: string | null;
  position?: number;
}
