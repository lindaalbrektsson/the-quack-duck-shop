import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import "./CartDrawer.css";
import CartList from "../Cartlist/CartList";
import type { CartItem } from "../../types/product";
import { useState } from "react";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

// Temporary example data until the list is connected to CartContext.
const exampleItems: CartItem[] = [
  {
    id: "duck-001",
    title: "Al Capone Duck",
    description: "An example product",
    price: 14.99,
    categories: ["onSale"],
    isOnSale: true,
    isLimitedEdition: false,
    salePrice: 9.99,
    images: {
      main: "/ducks/alcaponeduck.png",
      secondary: "/ducks/alcaponeduck2.png",
    },
    stock: 10,
    rating: 3,
    quantity: 2,
  },
];

function CartDrawer({ open, onClose }: CartDrawerProps) {
  // Keep example items in local state until CartContext handles updates.
  const [items, setItems] = useState<CartItem[]>(exampleItems);

  const changeQuantity = (id: string, change: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="cart-drawer">
        <div className="cart-drawer__header">
          <h2>YOUR CART</h2>

          <IconButton aria-label="close cart" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <CartList items={items} onQuantityChange={changeQuantity} onRemove={removeItem} />
      </div>
    </Drawer>
  );
}

export default CartDrawer;
