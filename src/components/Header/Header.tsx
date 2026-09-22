import "./Header.css";
import logo from "../../assets/logo.png";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

function Header() {
  const { totalQuantity } = useContext(CartContext)!;
  return (
    <header className="header">
      <div className="header-content">
        <img className="logo" src={logo} alt="The Quack Duck Shop" />

        <IconButton aria-label="cart">
          <Badge badgeContent={totalQuantity} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </div>
    </header>
  );
}

export default Header;
