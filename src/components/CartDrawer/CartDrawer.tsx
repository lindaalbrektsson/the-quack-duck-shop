import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import "./CartDrawer.css";
import CartList from "../Cartlist/CartList";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import { CartContext } from "../../context/CartContext";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}


function CartDrawer({ open, onClose }: CartDrawerProps) {
  const navigate = useNavigate();
  
  const {changeQuantity, cartItems, removeItem, totalPrice} = useContext(CartContext)!;

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
          items={cartItems}
          onQuantityChange={changeQuantity}
          onRemove={removeItem}
        />
        {cartItems.length > 0 && (
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
