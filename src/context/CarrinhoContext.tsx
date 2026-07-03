import { createContext, useCallback, useMemo, useState, useEffect, type ReactNode } from "react";
import type { CartItem, Produto } from "../types";

export type CarrinhoContextValue = {
  cart: CartItem[];
  addToCart: (product: Produto, color?: string, size?: string) => void;
  removeFromCart: (id: number, color: string, size: string) => void;
  updateQuantity: (id: number, color: string, size: string, delta: number) => void;
  totalItems: number;
  subtotal: number;
  gerarMensagemWhatsApp: (cartItems?: CartItem[]) => string;
};

export const CarrinhoContext = createContext<CarrinhoContextValue | undefined>(undefined);

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  // Inicializa o estado lendo do localStorage para não perder dados ao atualizar a página
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("tny_carrinho");
    return saved ? JSON.parse(saved) : [];
  });

  // Salva no localStorage sempre que o carrinho mudar
  useEffect(() => {
    localStorage.setItem("tny_carrinho", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Produto, color = "Padrão", size = "M") => {
    const newItem: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color,
      size,
      quantity: 1,
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

  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const gerarMensagemWhatsApp = useCallback(
    (cartItems: CartItem[] = cart) => {
      const itensTexto = cartItems
        .map((item) => `${item.quantity}x ${item.name} (${item.color} / ${item.size})`)
        .join("\n");

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
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      totalItems,
      subtotal,
      gerarMensagemWhatsApp,
    }),
    [cart, subtotal, totalItems, gerarMensagemWhatsApp],
  );

  return <CarrinhoContext.Provider value={value}>{children}</CarrinhoContext.Provider>;
}