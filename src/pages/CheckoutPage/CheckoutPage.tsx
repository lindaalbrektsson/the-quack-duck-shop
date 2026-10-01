import { useState } from "react";
import { useContext } from "react";
import CartList from "../../components/CartList/CartList";
import CustomerInfoForm, {
  type CustomerFormData,
} from "../../components/forms/CustomerInfoForm";
import ShippingForm, {
  type ShippingFormData,
} from "../../components/forms/ShippingForm";
import type { PaymentMethodFormData } from "../../components/forms/PaymentMethodForm";
import "./CheckoutPage.css";
import PaymentMethodForm from "../../components/forms/PaymentMethodForm";
import { CartContext } from "../../context/CartContext";
import { useMutation } from "@tanstack/react-query";
import type { CreateOrder, Order } from "../../types/order";
import type { Product } from "../../types/product";
import Alert from "@mui/material/Alert";

function CheckoutPage() {
  const [checkoutStep, setCheckoutStep] = useState<
    "customer" | "shipping" | "payment"
  >("customer");

  const { changeQuantity, cartItems, removeItem, totalPrice } =
    useContext(CartContext)!;

  const [stockError, setStockError] = useState<string | null>(null);

  const [customerInfo, setCustomerInfo] = useState<CustomerFormData | null>(
    null,
  );

  const [shippingInfo, setShippingInfo] = useState<ShippingFormData | null>(
    null,
  );

  const [shippingCost, setShippingCost] = useState(0);

  const handleCustomerContinue = (data: CustomerFormData) => {
    setCustomerInfo(data);
    setCheckoutStep("shipping");
  };

  const handleShippingContinue = (data: ShippingFormData) => {
    setShippingInfo(data);
    setShippingCost(data.shippingCost);
    setCheckoutStep("payment");
  };

  const checkStock = async () => {
    setStockError(null);

    try {
      const response = await fetch("http://localhost:3000/products");

      if (!response.ok) {
        throw new Error("Failed to check stock");
      }

      const products: Product[] = await response.json();

      const unavailableItem = cartItems.find((item) => {
        const currentProduct = products.find(
          (product) => product.id === item.id,
        );

        return !currentProduct || item.quantity > currentProduct.stock;
      });

      if (unavailableItem) {
        setStockError(
          `Oh quack! There aren't enough "${unavailableItem.title}" left in stock. Please update your cart and try again. 🐥`,
        );
        return false;
      }

      return true;
    } catch {
      setStockError(
        "Oh quack! We couldn't check the duck stock right now. Please try again. 🐥",
      );
      return false;
    }
  };

  const handlePaymentContinue = async (data: PaymentMethodFormData) => {
    if (!customerInfo || !shippingInfo) {
      return;
    }

    const stockIsAvailable = await checkStock();

    if (!stockIsAvailable) {
      return;
    }

    const order: CreateOrder = {
      orderNumber: `QD-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: customerInfo.customerName,
      customerAddress: customerInfo.customerAddress,
      shippingMethod: shippingInfo.shippingMethod,
      paymentMethod: data.paymentMethod,
      createdAt: new Date().toISOString(),
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice:
          item.isOnSale && item.salePrice !== null
            ? item.salePrice
            : item.price,
      })),
    };

    createOrderMutation.mutate(order);
  };

  const orderTotal = totalPrice + shippingCost;

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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

  return (
    <section className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-page__layout">
        <div className="checkout-page__main">
          {checkoutStep === "customer" && (
            <>
              <CartList
                items={cartItems}
                onQuantityChange={changeQuantity}
                onRemove={removeItem}
              />

              <CustomerInfoForm onContinue={handleCustomerContinue} />
            </>
          )}

          {checkoutStep === "shipping" && (
            <ShippingForm
              onContinue={handleShippingContinue}
              onShippingChange={setShippingCost}
            />
          )}

          {checkoutStep === "payment" && (
            <>
              <PaymentMethodForm onContinue={handlePaymentContinue} />

              {stockError && (
                <div className="checkout-page__stock-error">
                  <Alert
                    severity="warning"
                    variant="filled"
                    sx={{
                      backgroundColor: "var(--color-light-orange)",
                      color: "var(--color-black)",
                      fontWeight: 600,
                      "& .MuiAlert-icon": {
                        color: "var(--color-black)",
                      },
                    }}
                  >
                    {stockError}
                  </Alert>

                  <button
                    type="button"
                    className="checkout-page__back-button"
                    onClick={() => setCheckoutStep("customer")}
                  >
                    ← Back to Cart
                  </button>
                </div>
              )}

              {createOrderMutation.isPending && (
                <p>Just a quack... placing your order! 🐥</p>
              )}

              {createOrderMutation.isError && (
                <p>
                  Oh quack! We couldn't place your order. Please try again. 🐥
                </p>
              )}
            </>
          )}
        </div>

        <aside className="checkout-page__summary">
          <h2>Your Order Resume</h2>

          {checkoutStep === "customer" && (
            <>
              <p>{totalQuantity} articles</p>

              <div className="checkout-page__summary-items">
                {cartItems.map((item) => {
                  const itemPrice =
                    item.isOnSale && item.salePrice !== null
                      ? item.salePrice
                      : item.price;

                  return (
                    <div className="checkout-page__summary-item" key={item.id}>
                      <span>{item.title}</span>
                      <span>
                        {item.quantity} × ${itemPrice.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {checkoutStep !== "customer" && (
            <CartList items={cartItems} readOnly />
          )}

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
