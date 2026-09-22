import "./Header.css";
import logo from "../../assets/logo.png";
import { useContext, useState } from "react";
import { CartContext } from "../../context/CartContext";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CartDrawer from "../CartDrawer/CartDrawer";

function Header() {
  const { totalQuantity } = useContext(CartContext)!;
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        <img className="logo" src={logo} alt="The Quack Duck Shop" />

        <IconButton
          className="cart-button"
          aria-label="cart"
          onClick={() => {
            if (totalQuantity > 0) {
              setCartOpen(true);
            }
          }}
        >
          <Badge badgeContent={totalQuantity} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </header>
  );
}

export default Header;
