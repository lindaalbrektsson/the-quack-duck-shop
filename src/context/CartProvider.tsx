import type { ReactNode } from "react";
import type { Product, CartItem } from "../types/product";
import { CartContext } from "./CartContext";
import useLocalStorage from "../hooks/useLocalStorage";

type CartProviderProps = {
  children: ReactNode;
};

export function CartProvider({ children }: CartProviderProps) {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "cartItems",
    [],
  );

  const addToCart = (product: Product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (product.stock <= 0) {
        return currentItems;
      }

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                stock: product.stock,
                quantity: Math.min(item.quantity + 1, product.stock),
              }
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

  const updateCartItemStock = (id: string, stock: number) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === id
            ? {
                ...item,
                stock,
                quantity: Math.min(item.quantity, stock),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
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
        updateCartItemStock,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
