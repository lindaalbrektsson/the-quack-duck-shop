import { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { Product, CartItem } from "../types/product";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  totalQuantity: number;
  changeQuantity: (id: string, change: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalPrice: number;
}

interface CartProviderProps {
  children: ReactNode;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined,
);

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (product.stock <= 0) {
        return currentItems;
      }

      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          return currentItems;
        }

        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const changeQuantity = (id: string, change: number) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.min(
                item.stock,
                Math.max(1, item.quantity + change),
              ),
            }
          : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== id),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce((total, item) => {
    const price =
      item.isOnSale && item.salePrice !== null ? item.salePrice : item.price;

    return total + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        totalQuantity,
        changeQuantity,
        removeItem,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
