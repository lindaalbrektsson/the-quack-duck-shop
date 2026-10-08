import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import Alert from "@mui/material/Alert";

import CartList from "../../components/CartList/CartList";
import CustomerInfoForm, {
  type CustomerFormData,
} from "../../forms/CustomerInfoForm";
import ShippingForm, { type ShippingFormData } from "../../forms/ShippingForm";
import PaymentMethodForm, {
  type PaymentMethodFormData,
} from "../../forms/PaymentMethodForm";

import { fetchProducts, productsQueryKey } from "../../api/fetchProducts";
import { updateProductStock } from "../../api/patchProduct";

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

  const {
    refetch: refetchProducts,
    isFetching,
    isError,
  } = useQuery({
    queryKey: productsQueryKey,
    queryFn: fetchProducts,
    enabled: false,
  });

  const checkStock = async () => {
    setStockError(null);

    const { data: products, error } = await refetchProducts();

    if (error || !products) {
      setStockError(
        "Oh quack! We couldn't check the duck stock right now. Please try again. 🐥",
      );

      return {
        isAvailable: false,
        products: null,
      };
    }

    const unavailableItem = cartItems.find((item) => {
      const currentProduct = products.find((product) => product.id === item.id);

      return !currentProduct || item.quantity > currentProduct.stock;
    });

    if (unavailableItem) {
      setStockError(
        `Oh quack! There aren't enough "${unavailableItem.title}" left in stock. Please update your cart and try again. 🐥`,
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
    if (!customerInfo || !shippingInfo) {
      return;
    }

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
      shippingCost: shippingCost,
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
      const product = products.find((product) => product.id === item.productId);

      if (!product) {
        return;
      }

      const newStock = product.stock - item.quantity;

      await updateStockMutation.mutateAsync({
        productId: item.productId,
        stock: newStock,
      });
    }

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

              <PaymentMethodForm
                onContinue={handlePaymentContinue}
                isPending={createOrderMutation.isPending}
                isFetching={isFetching}
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
                    onClick={() => setCheckoutStep("customer")}
                  >
                    ← Return to Cart
                  </button>
                </>
              )}

              {isFetching && <p>Checking duck stock... 🐥</p>}

              {isError && <p>Can't check stock.</p>}

              {createOrderMutation.isPending && (
                <p>Just a quack... placing your order! 🐥</p>
              )}

              {createOrderMutation.isError && (
                <p>
                  Oh quack! We couldn't place your order. Please try again. 🐥
                </p>
              )}

              {updateStockMutation.isPending && (
                <p> Updating duck stock... Please quack tight! 🐥</p>
              )}

              {updateStockMutation.isError && (
                <p>
                  Oh quack! We couldn't update the duck stock. Pleace try again.
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
