import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import "./CartDrawer.css";
import CartList from "../CartList/CartList";
import type { CartItem } from "../../types/product";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../PrimaryButton/PrimaryButton";

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
    quantity: 1,
  },
  {
    id: "duck-002",
    title: "Bat Duck",
    description: "The bathtub needs a hero.",
    price: 16.99,
    categories: ["mostPopular"],
    isOnSale: false,
    isLimitedEdition: false,
    salePrice: null,
    images: {
      main: "/ducks/batduck.png",
      secondary: "/ducks/batduck2.png",
    },
    stock: 15,
    rating: 5,
    quantity: 1,
  },
  {
    id: "duck-003",
    title: "Beer Duck",
    description: "Clock out and float away.",
    price: 12.99,
    categories: [],
    isOnSale: false,
    isLimitedEdition: false,
    salePrice: null,
    images: {
      main: "/ducks/beerduck.png",
      secondary: "/ducks/beerduck2.png",
    },
    stock: 12,
    rating: 2,
    quantity: 1,
  },
];

function CartDrawer({ open, onClose }: CartDrawerProps) {
  const navigate = useNavigate();

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
  };

  // Add up all product totals, including sale prices.
  const totalPrice = items.reduce((total, item) => {
    const price =
      item.isOnSale && item.salePrice !== null ? item.salePrice : item.price;

    return total + price * item.quantity;
  }, 0);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="cart-drawer">
        <div className="cart-drawer__header">
          <h2>YOUR CART</h2>

          <IconButton aria-label="close cart" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <CartList
          items={items}
          onQuantityChange={changeQuantity}
          onRemove={removeItem}
        />
        {items.length > 0 && (
          <div className="cart-drawer__total">
            <p>Total: ${totalPrice.toFixed(2)}</p>
            <PrimaryButton
              onClick={() => {
                navigate("/checkout");
                onClose();
              }}
            >
              GO TO CHECKOUT
            </PrimaryButton>
          </div>
        )}
      </div>
    </Drawer>
  );
}

export default CartDrawer;
