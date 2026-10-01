import { useContext, useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import type { Product } from "../types/product";
import { CartContext } from "../context/CartContext";
import PrimaryButton from "./PrimaryButton/PrimaryButton";

type AddToCartButtonProps = {
  product: Product;
};

function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart, cartItems } = useContext(CartContext)!;

  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<"success" | "warning">("success");
  const [maxAttempted, setMaxAttempted] = useState(false);

  const cartItem = cartItems.find((item) => item.id === product.id);
  const quantityInCart = cartItem?.quantity ?? 0;

  const isOutOfStock = product.stock <= 0;
  const maxInCart = quantityInCart >= product.stock;

  const [snackbarKey, setSnackbarKey] = useState(0);

  useEffect(() => {
    if (quantityInCart < product.stock) {
      setMaxAttempted(false);
    }
  }, [quantityInCart, product.stock]);

  const handleAddToCart = () => {
    if (maxInCart) {
      setMessage(
        `Oh quack! You already have all ${product.stock} ${product.title}s in your cart. 🐥`,
      );
      setSeverity("warning");
      setSnackbarKey((key) => key + 1);
      setOpen(true);
      setMaxAttempted(true);
      return;
    }

    addToCart(product);

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
          sx={{
            backgroundColor:
              severity === "success"
                ? "var(--color-green)"
                : "var(--color-light-orange)",
            color: "var(--color-black)",
            fontWeight: 600,
            boxShadow: 3,
            "& .MuiAlert-icon": {
              color: "var(--color-black)",
            },
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default AddToCartButton;
