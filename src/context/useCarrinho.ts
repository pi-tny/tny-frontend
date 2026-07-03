import { useContext } from "react";
import { CarrinhoContext } from "./CarrinhoContext";

export function useCarrinho() {
  const context = useContext(CarrinhoContext);

  if (!context) {
    throw new Error("useCarrinho must be used within a CarrinhoProvider");
  }

  return context;
}
