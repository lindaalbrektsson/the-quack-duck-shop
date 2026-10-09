import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CartList from "../CartList/CartList";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import { CartContext } from "../../context/CartContext";
import { fetchProducts, productsQueryKey } from "../../api/fetchProducts";
import "./CartDrawer.css";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

function CartDrawer({ open, onClose }: CartDrawerProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    changeQuantity,
    updateCartItemStock,
    cartItems,
    removeItem,
    totalPrice,
  } = useContext(CartContext)!;

  const [cartAlert, setCartAlert] = useState("");
  const [cartAlertOpen, setCartAlertOpen] = useState(false);
  const [snackbarKey, setSnackbarKey] = useState(0);

  const showCartAlert = (message: string) => {
    setCartAlert(message);
    setSnackbarKey((key) => key + 1);
    setCartAlertOpen(true);
  };

  const handleQuantityChange = async (id: string, change: number) => {
    if (change < 0) {
      changeQuantity(id, change);
      return;
    }

    try {
      const products = await queryClient.fetchQuery({
        queryKey: productsQueryKey,
        queryFn: fetchProducts,
        staleTime: 0,
      });

      const product = products.find((product) => product.id === id);
      const cartItem = cartItems.find((item) => item.id === id);

      if (!product || !cartItem) {
        showCartAlert("Oh quack! We couldn't find this duck. 🐥");
        return;
      }

      // Update the cart item's stored stock with the latest API value.
      updateCartItemStock(id, product.stock);

      if (cartItem.quantity >= product.stock) {
        showCartAlert(
          `Oh quack! You've already got all available ${product.title}s in your cart! 🐥`,
        );
        return;
      }

      changeQuantity(id, change);
    } catch {
      showCartAlert(
        "Oh quack! We couldn't check the duck stock right now. Please try again. 🐥",
      );
    }
  };

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
          onQuantityChange={handleQuantityChange}
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

      <Snackbar
        key={snackbarKey}
        open={cartAlertOpen}
        autoHideDuration={3000}
        onClose={() => setCartAlertOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={() => setCartAlertOpen(false)}
          severity="warning"
          variant="filled"
          className="cart-drawer__stock-alert"
        >
          {cartAlert}
        </Alert>
      </Snackbar>
    </Drawer>
  );
}

export default CartDrawer;
