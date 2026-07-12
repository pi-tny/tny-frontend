import { z } from "zod";

// shared form schemas. messages are in pt-br because they surface directly in toasts.

export const adminSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome."),
  email: z.email("E-mail inválido."),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres."),
});

// on edit the password may be left blank to keep the current one
export const adminEditSchema = adminSchema.partial({ password: true }).extend({
  password: z
    .string()
    .refine((v) => v === "" || v.length >= 6, "A senha deve ter ao menos 6 caracteres."),
});

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Informe o nome da categoria."),
});

export const checkoutSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome."),
  phone: z.string().trim().min(1, "Informe seu WhatsApp ou telefone."),
});

export const productSchema = z.object({
  sku: z.string().trim().min(1),
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  price: z.number().positive(),
});

// runs a schema and shows the first issue via the given toast; returns the parsed
// data on success or null on failure, so callers can `if (!parsed) return;`.
export function validateForm<T>(
  schema: z.ZodType<T>,
  input: unknown,
  showError: (message: string) => void,
  fallbackMessage?: string,
): T | null {
  const result = schema.safeParse(input);
  if (result.success) return result.data;
  showError(fallbackMessage ?? result.error.issues[0].message);
  return null;
}
