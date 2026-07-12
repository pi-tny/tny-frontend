import type { OrderStatus } from "../types";

/** statuses the admin can set (accepted by the backend in the patch and filter). */
export const ORDER_STATUSES: OrderStatus[] = ["new", "fulfilled", "ignored"];

type Tone = "accent" | "price" | "neutral" | "danger";

// includes actionable values plus legacy ones that may exist in the db (seed).
const STATUS_LABELS: Record<string, string> = {
  new: "Novo",
  fulfilled: "Atendido",
  ignored: "Ignorado",
  processing: "Em processamento",
  cancelled: "Cancelado",
  pending: "Pendente",
};

const STATUS_TONES: Record<string, Tone> = {
  new: "accent",
  fulfilled: "price",
  ignored: "neutral",
  processing: "accent",
  cancelled: "danger",
  pending: "accent",
};

/** label for an actionable status (for typed buttons/chips). */
export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  new: STATUS_LABELS.new,
  fulfilled: STATUS_LABELS.fulfilled,
  ignored: STATUS_LABELS.ignored,
};

/** tolerant of unknown statuses: humanizes the raw string as a fallback. */
export function orderStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status.charAt(0).toUpperCase() + status.slice(1);
}

export function orderStatusTone(status: string): Tone {
  return STATUS_TONES[status] ?? "neutral";
}

export const PAYMENT_LABEL: Record<string, string> = {
  to_be_defined: "A definir",
  boleto: "Boleto",
  credit_card: "Cartão de crédito",
  cash: "Dinheiro",
  pix: "Pix",
  bank_transfer: "Transferência bancária",
};

export function formatBRL(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}
