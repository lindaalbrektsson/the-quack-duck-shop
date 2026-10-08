import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Alert from "@mui/material/Alert";

import CartList from "../../components/CartList/CartList";
import CustomerInfoForm, {
  type CustomerFormData,
} from "../../forms/CustomerInfoForm";
import ShippingForm, { type ShippingFormData } from "../../forms/ShippingForm";
import PaymentMethodForm, {
  type PaymentMethodFormData,
} from "../../forms/PaymentMethodForm";

import { fetchProducts } from "../../api/fetchProducts";
import { updateProductStock } from "../../api/patchProduct";

import { CartContext } from "../../context/CartContext";
import type { CreateOrder, Order } from "../../types/order";

import "./CheckoutPage.css";

function CheckoutPage() {
  const navigate = useNavigate();
  const submittingRef = useRef(false);
  const checkingStockRef = useRef(false);

  const [checkoutStep, setCheckoutStep] = useState<
    "customer" | "shipping" | "payment"
  >("customer");

  const {
    changeQuantity,
    cartItems,
    removeItem,
    totalPrice,
    clearCart,
    updateCartItemStock,
  } = useContext(CartContext)!;

  const [stockError, setStockError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingStock, setIsCheckingStock] = useState(false);

  const [customerInfo, setCustomerInfo] = useState<CustomerFormData | null>(
    null,
  );

  const [shippingInfo, setShippingInfo] = useState<ShippingFormData | null>(
    null,
  );

  const [shippingCost, setShippingCost] = useState(0);

  // Check current stock when increasing quantity.
  const handleQuantityChange = async (id: string, change: number) => {
    if (checkingStockRef.current || submittingRef.current) {
      return;
    }

    setStockError(null);

    if (change < 0) {
      changeQuantity(id, change);
      return;
    }

    const cartItem = cartItems.find((item) => item.id === id);

    if (!cartItem) {
      return;
    }

    checkingStockRef.current = true;
    setIsCheckingStock(true);

    try {
      const products = await fetchProducts();

      const currentProduct = products.find((product) => product.id === id);

      if (!currentProduct) {
        removeItem(id);
        setStockError(
          `Oh quack! ${cartItem.title} is no longer available and has been removed from your cart. 🐥`,
        );
        return;
      }

      const currentStock = currentProduct.stock;

      // Always update the cart with the latest stock.
      updateCartItemStock(id, currentStock);

      if (currentStock <= 0) {
        setStockError(
          `Oh quack! ${cartItem.title} is sold out and has been removed from your cart. 🐥`,
        );
        return;
      }

      if (cartItem.quantity > currentStock) {
        setStockError(
          `Oh quack! Only ${currentStock} ${cartItem.title} available. Your cart has been updated automatically. 🐥`,
        );
        return;
      }

      if (cartItem.quantity >= currentStock) {
        setStockError(
          `Oh quack! You already have all ${currentStock} available ${cartItem.title} in your cart. 🐥`,
        );
        return;
      }

      // Increase quantity after checking the latest stock.
      changeQuantity(id, change);
    } catch (error) {
      console.error("Stock check failed:", error);
      setStockError(
        "Oh quack! We couldn't check the duck stock right now. Please try again. 🐥",
      );
    } finally {
      checkingStockRef.current = false;
      setIsCheckingStock(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    setStockError(null);
    removeItem(id);
  };

  const handleCustomerContinue = (data: CustomerFormData) => {
    if (cartItems.length === 0) {
      setStockError(
        "Oh quack! Your cart is empty. Please add some ducks first. 🐥",
      );
      return;
    }

    setStockError(null);
    setCustomerInfo(data);
    setCheckoutStep("shipping");
  };

  const handleShippingContinue = (data: ShippingFormData) => {
    setShippingInfo(data);
    setShippingCost(data.shippingCost);
    setCheckoutStep("payment");
  };

  const handleReturnToCart = () => {
    setCheckoutStep("customer");
  };

  // Check current stock before placing an order.
  const checkStock = async () => {
    setStockError(null);

    if (cartItems.length === 0) {
      setStockError(
        "Oh quack! Your cart is empty. Please add some ducks before placing an order. 🐥",
      );

      return {
        isAvailable: false,
        products: null,
      };
    }

    try {
      const products = await fetchProducts();
      const messages: string[] = [];

      cartItems.forEach((item) => {
        const currentProduct = products.find(
          (product) => product.id === item.id,
        );

        if (!currentProduct) {
          removeItem(item.id);

          messages.push(
            `${item.title} is no longer available and has been removed from your cart.`,
          );
          return;
        }

        const currentStock = currentProduct.stock;

        // Sync stock even when it has increased.
        if (item.stock !== currentStock) {
          updateCartItemStock(item.id, currentStock);
        }

        if (item.quantity > currentStock) {
          if (currentStock <= 0) {
            messages.push(
              `${item.title} is sold out and has been removed from your cart.`,
            );
          } else {
            messages.push(
              `Only ${currentStock} ${currentProduct.title} available.`,
            );
          }
        }
      });

      if (messages.length > 0) {
        setStockError(
          `Oh quack! ${messages.join(" ")} Your cart has been updated automatically. Please review it before continuing. 🐥`,
        );

        return {
          isAvailable: false,
          products: null,
        };
      }

      return {
        isAvailable: true,
        products,
      };
    } catch (error) {
      console.error("Stock check failed:", error);

      setStockError(
        "Oh quack! We couldn't check the duck stock right now. Please try again. 🐥",
      );

      return {
        isAvailable: false,
        products: null,
      };
    }
  };

  const createOrderMutation = useMutation<Order, Error, CreateOrder>({
    mutationFn: async (order) => {
      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error("Failed to save order");
      }

      return response.json();
    },
  });

  const updateStockMutation = useMutation({
    mutationFn: ({ productId, stock }: { productId: string; stock: number }) =>
      updateProductStock(productId, stock),
  });

  const handlePaymentContinue = async (data: PaymentMethodFormData) => {
    if (
      !customerInfo ||
      !shippingInfo ||
      submittingRef.current ||
      checkingStockRef.current
    ) {
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      const { isAvailable, products } = await checkStock();

      if (!isAvailable || !products) {
        return;
      }

      const orderNumber = `QD-${crypto
        .randomUUID()
        .replaceAll("-", "")
        .slice(0, 12)
        .toUpperCase()}`;

      const order: CreateOrder = {
        orderNumber,
        customerName: customerInfo.customerName,
        customerAddress: customerInfo.customerAddress,
        shippingMethod: shippingInfo.shippingMethod,
        shippingCost,
        paymentMethod: data.paymentMethod,
        createdAt: new Date().toISOString(),
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          isOnSale: item.isOnSale && item.salePrice !== null,
          price:
            item.isOnSale && item.salePrice !== null
              ? item.salePrice
              : item.price,
        })),
      };

      await createOrderMutation.mutateAsync(order);

      for (const item of order.items) {
        const product = products.find(
          (product) => product.id === item.productId,
        );

        if (!product) {
          throw new Error("Product not found");
        }

        await updateStockMutation.mutateAsync({
          productId: item.productId,
          stock: product.stock - item.quantity,
        });
      }

      clearCart();
      navigate(`/order-confirmation/${orderNumber}`);
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const orderTotal = totalPrice + shippingCost;

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-page__layout">
        <div className="checkout-page__main">
          {checkoutStep === "customer" && (
            <>
              <button
                type="button"
                className="checkout-page__back-button"
                onClick={() => navigate("/")}
              >
                ← Back to Shop
              </button>

              {stockError && (
                <Alert
                  severity="warning"
                  className="checkout-page__stock-alert"
                  sx={{ mb: 2 }}
                >
                  {stockError}
                </Alert>
              )}

              <CartList
                items={cartItems}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
              />

              <CustomerInfoForm onContinue={handleCustomerContinue} />

              {isCheckingStock && <p>Checking duck stock... 🐥</p>}
            </>
          )}

          {checkoutStep === "shipping" && (
            <>
              <button
                type="button"
                className="checkout-page__back-button"
                onClick={handleReturnToCart}
              >
                ← Back to Customer Information
              </button>

              <ShippingForm
                onContinue={handleShippingContinue}
                onShippingChange={setShippingCost}
              />
            </>
          )}

          {checkoutStep === "payment" && (
            <>
              <button
                type="button"
                className="checkout-page__back-button"
                onClick={() => setCheckoutStep("shipping")}
              >
                ← Back to Shipping Details
              </button>

              <PaymentMethodForm
                onContinue={handlePaymentContinue}
                isPending={
                  isSubmitting ||
                  createOrderMutation.isPending ||
                  updateStockMutation.isPending
                }
                isFetching={isCheckingStock}
              />

              {stockError && (
                <>
                  <Alert
                    severity="warning"
                    variant="filled"
                    className="checkout-page__stock-alert"
                  >
                    {stockError}
                  </Alert>

                  <button
                    type="button"
                    className="checkout-page__back-button"
                    onClick={handleReturnToCart}
                  >
                    ← Return to Cart
                  </button>
                </>
              )}

              {isSubmitting &&
                !createOrderMutation.isPending &&
                !updateStockMutation.isPending && (
                  <p>Checking duck stock... 🐥</p>
                )}

              {createOrderMutation.isPending && (
                <p>Just a quack... placing your order! 🐥</p>
              )}

              {createOrderMutation.isError && (
                <p>
                  Oh quack! We couldn't place your order. Please try again. 🐥
                </p>
              )}

              {updateStockMutation.isPending && (
                <p>Updating duck stock... Please quack tight! 🐥</p>
              )}

              {updateStockMutation.isError && (
                <p>
                  Oh quack! We couldn't update the duck stock. Please try again.
                  🐥
                </p>
              )}
            </>
          )}
        </div>

        <aside className="checkout-page__summary">
          <h2>Your Order Summary</h2>

          <p>{totalQuantity} items</p>

          <div className="checkout-page__summary-items">
            {cartItems.map((item) => {
              const itemPrice =
                item.isOnSale && item.salePrice !== null
                  ? item.salePrice
                  : item.price;

              return (
                <div className="checkout-page__summary-item" key={item.id}>
                  <span>{item.title}</span>
                  <span
                    className={
                      item.isOnSale && item.salePrice !== null
                        ? "sale-price"
                        : ""
                    }
                  >
                    {item.quantity} × ${itemPrice.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="checkout-page__summary-total">
            <strong>Total:</strong>
            <strong>${orderTotal.toFixed(2)}</strong>
          </div>

          <div className="checkout-page__shipping">
            <span>Shipping fee</span>
            <span>${shippingCost.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default CheckoutPage;
