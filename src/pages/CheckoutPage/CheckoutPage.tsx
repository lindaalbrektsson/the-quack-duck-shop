import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import Alert from "@mui/material/Alert";

import CartList from "../../components/CartList/CartList";
import CustomerInfoForm, {
  type CustomerFormData,
} from "../../components/forms/CustomerInfoForm";
import ShippingForm, {
  type ShippingFormData,
} from "../../components/forms/ShippingForm";
import PaymentMethodForm, {
  type PaymentMethodFormData,
} from "../../components/forms/PaymentMethodForm";

import { fetchProducts, productsQueryKey } from "../../api/products";

import { CartContext } from "../../context/CartContext";
import type { CreateOrder, Order } from "../../types/order";

import "./CheckoutPage.css";

function CheckoutPage() {
  const navigate = useNavigate();

  const [checkoutStep, setCheckoutStep] = useState<
    "customer" | "shipping" | "payment"
  >("customer");

  const { changeQuantity, cartItems, removeItem, totalPrice, clearCart } =
    useContext(CartContext)!;

  const [stockError, setStockError] = useState<string | null>(null);

  const [customerInfo, setCustomerInfo] = useState<CustomerFormData | null>(
    null,
  );

  const [shippingInfo, setShippingInfo] = useState<ShippingFormData | null>(
    null,
  );

  const [shippingCost, setShippingCost] = useState(0);

  const handleQuantityChange = (id: string, change: number) => {
    setStockError(null);
    changeQuantity(id, change);
  };

  const handleRemoveItem = (id: string) => {
    setStockError(null);
    removeItem(id);
  };

  const handleCustomerContinue = (data: CustomerFormData) => {
    setCustomerInfo(data);
    setCheckoutStep("shipping");
  };

  const handleShippingContinue = (data: ShippingFormData) => {
    setShippingInfo(data);
    setShippingCost(data.shippingCost);
    setCheckoutStep("payment");
  };

  const { refetch: refetchProducts } = useQuery({
    queryKey: productsQueryKey,
    queryFn: fetchProducts,
    enabled: false,
  });

  const checkStock = async () => {
    setStockError(null);

    try {
      const { data: products, error } = await refetchProducts();

      if (error || !products) {
        throw new Error("Failed to check stock");
      }

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

  const handlePaymentContinue = async (data: PaymentMethodFormData) => {
    if (!customerInfo || !shippingInfo) {
      return;
    }

    const stockIsAvailable = await checkStock();

    if (!stockIsAvailable) {
      return;
    }

    const orderNumber = `QD-${Math.floor(100000 + Math.random() * 900000)}`;

    const order: CreateOrder = {
      orderNumber,
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

    await createOrderMutation.mutateAsync(order);

    clearCart();
    navigate(`/order-confirmation/${orderNumber}`);
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

              <CartList
                items={cartItems}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
              />

              <CustomerInfoForm onContinue={handleCustomerContinue} />
            </>
          )}

          {checkoutStep === "shipping" && (
            <>
              <button
                type="button"
                className="checkout-page__back-button"
                onClick={() => setCheckoutStep("customer")}
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

              <PaymentMethodForm onContinue={handlePaymentContinue} />

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
                    onClick={() => setCheckoutStep("customer")}
                  >
                    ← Return to Cart
                  </button>
                </>
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
