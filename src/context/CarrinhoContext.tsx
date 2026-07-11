/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useMemo, useState, useEffect, type ReactNode } from "react";
import type { CartItem, Produto } from "../types";

export type CarrinhoContextValue = {
  cart: CartItem[];
  addToCart: (product: Produto, color?: string, size?: string, variantId?: number) => void;
  removeFromCart: (id: number, color: string, size: string) => void;
  updateQuantity: (id: number, color: string, size: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  gerarMensagemWhatsApp: (cartItems?: CartItem[]) => string;
};

export const CarrinhoContext = createContext<CarrinhoContextValue | undefined>(undefined);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("tny_carrinho");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tny_carrinho", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Produto, color = "Padrão", size = "Único", variantId?: number) => {
    const newItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.promotional_price ?? product.price,
      image: product.image,
      color,
      size,
      quantity: 1,
      variantId,
    };

    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === newItem.id && item.color === newItem.color && item.size === newItem.size,
      );
      if (existing) {
        return prev.map((item) =>
          item.id === newItem.id && item.color === newItem.color && item.size === newItem.size
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: number, color: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.color === color && item.size === size)));
  };

  const updateQuantity = (id: number, color: string, size: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id && item.color === color && item.size === size
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const gerarMensagemWhatsApp = useCallback(
    (cartItems: CartItem[] = cart) => {
      const itensTexto = cartItems
        .map((item) => {
          const linkProduto = `${window.location.origin}/produto/${item.id}`;
          return `${item.quantity}x ${item.name} (${item.color} / ${item.size}) - Confira: ${linkProduto}`;
        })
        .join("\n\n");
      const subtotalTexto = subtotal.toFixed(2).replace(".", ",");
      return [
        "Olá! Quero finalizar a compra da TNY.",
        "",
        itensTexto || "Nenhum item selecionado.",
        "",
        `Subtotal: R$ ${subtotalTexto}`,
      ].join("\n");
    },
    [cart, subtotal],
  );

  const value = useMemo(
    () => ({ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal, gerarMensagemWhatsApp }),
    [cart, subtotal, totalItems, gerarMensagemWhatsApp],
  );

  return <CarrinhoContext.Provider value={value}>{children}</CarrinhoContext.Provider>;
}
