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

      if (existingItem) {
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

  //Function to change the quantity of the product in cart. 
   const changeQuantity = (id: string, change: number) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item,
      ),
    );
  };

  //Function for removing a product in cart
    const removeItem = (id: string) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  //Function to clear the cart
  const clearCart = () => {
    setCartItems([]);
  };

  //function that counts and returns the total price.
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
