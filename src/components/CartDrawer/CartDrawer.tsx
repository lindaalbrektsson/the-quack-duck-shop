import Drawer from "@mui/material/Drawer";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

function CartDrawer({ open, onClose }: CartDrawerProps) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <div>YOUR CART</div>
    </Drawer>
  );
}

export default CartDrawer;
