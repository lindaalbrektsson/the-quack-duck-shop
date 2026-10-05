import { useContext, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import type { Product } from "../../types/product";
import { CartContext } from "../../context/CartContext";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import "./AddToCartButton.css";

type AddToCartButtonProps = {
  product: Product;
};

function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart, cartItems } = useContext(CartContext)!;

  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<"success" | "warning">("success");
  const [maxAttemptedAtQuantity, setMaxAttemptedAtQuantity] = useState<
    number | null
  >(null);

  const cartItem = cartItems.find((item) => item.id === product.id);
  const quantityInCart = cartItem?.quantity ?? 0;

  const isOutOfStock = product.stock <= 0;
  const maxInCart = quantityInCart >= product.stock;

  const maxAttempted = maxInCart && maxAttemptedAtQuantity === quantityInCart;

  const [snackbarKey, setSnackbarKey] = useState(0);

  const handleAddToCart = () => {
    if (maxInCart) {
      setMessage(
        `Oh quack! You already have all ${product.stock} ${product.title}s in your cart. 🐥`,
      );
      setSeverity("warning");
      setSnackbarKey((key) => key + 1);
      setOpen(true);
      setMaxAttemptedAtQuantity(quantityInCart);
      return;
    }

    addToCart(product);
    setMaxAttemptedAtQuantity(null);

    setMessage(`Quack! ${product.title} just waddled into your cart. 🐥`);
    setSeverity("success");
    setSnackbarKey((key) => key + 1);
    setOpen(true);
  };

  return (
    <>
      <PrimaryButton
        onClick={handleAddToCart}
        disabled={isOutOfStock || maxAttempted}
      >
        {isOutOfStock
          ? "SOLD OUT"
          : maxAttempted
            ? "MAX IN CART"
            : "ADD TO CART"}
      </PrimaryButton>

      <Snackbar
        key={snackbarKey}
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={severity}
          variant="filled"
          className={`add-to-cart-alert add-to-cart-alert--${severity}`}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default AddToCartButton;
