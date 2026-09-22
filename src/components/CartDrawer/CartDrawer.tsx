import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import "./CartDrawer.css";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

function CartDrawer({ open, onClose }: CartDrawerProps) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div className="cart-drawer">
        <div className="cart-drawer__header">
          <h2>YOUR CART</h2>

          <IconButton aria-label="close cart" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </div>
    </Drawer>
  );
}

export default CartDrawer;
