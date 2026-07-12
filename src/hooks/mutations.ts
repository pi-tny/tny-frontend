import { useMutation, useQueryClient } from "@tanstack/react-query";
import { keys } from "./queries";
import {
  createOrder,
  subscribeLead,
  adminUpdateProduct,
  adminUpdateVariant,
  adminUpdateOrderStatus,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminCreateAdmin,
  adminUpdateAdmin,
  adminDeleteAdmin,
  adminDeleteLead,
} from "../services/api";
import type {
  AdminProductUpdate,
  AdminVariantUpdate,
  CategoryBody,
  AdminCreate,
  AdminUpdate,
  OrderStatus,
} from "../types";

// storefront
export function useCreateOrder() {
  return useMutation({ mutationFn: createOrder });
}

export function useSubscribeLead() {
  return useMutation({ mutationFn: subscribeLead });
}

// admin: products / stock
export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: AdminProductUpdate }) => adminUpdateProduct(id, body),
    onSuccess: (product) => {
      qc.setQueryData(keys.admin.product(product.id), product);
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

export function useUpdateVariant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: AdminVariantUpdate }) => adminUpdateVariant(id, body),
    onSuccess: () => {
      // the edited variant belongs to a product detail; refresh both.
      qc.invalidateQueries({ queryKey: ["admin", "product"] });
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });
}

// admin: orders
export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: OrderStatus }) => adminUpdateOrderStatus(id, status),
    onSuccess: (order) => {
      qc.setQueryData(keys.admin.order(order.id), order);
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });
}

// admin: categories
export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CategoryBody) => adminCreateCategory(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.admin.categories }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: CategoryBody }) => adminUpdateCategory(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.admin.categories }),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminDeleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.admin.categories }),
  });
}

// admin: admins
export function useCreateAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: AdminCreate) => adminCreateAdmin(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.admin.admins }),
  });
}

export function useUpdateAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: AdminUpdate }) => adminUpdateAdmin(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.admin.admins }),
  });
}

export function useDeleteAdmin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminDeleteAdmin(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: keys.admin.admins }),
  });
}

// admin: leads
export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminDeleteLead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "leads"] }),
  });
}
