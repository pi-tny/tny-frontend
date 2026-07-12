// shared product sort options, used by the storefront (Produtos) and the admin
// stock page so both stay in sync.

export const SORT_OPTIONS = [
  { value: "newest", label: "Novidades" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "name", label: "Nome (A–Z)" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

/** narrows an arbitrary string to a valid SortValue, falling back to "newest". */
export function toSortValue(value: string | null | undefined): SortValue {
  return SORT_OPTIONS.some((o) => o.value === value) ? (value as SortValue) : "newest";
}
