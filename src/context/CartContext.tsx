import { createContext } from "react";
import type { Product, CartItem } from "../types/product";

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  totalQuantity: number;
  changeQuantity: (id: string, change: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);
