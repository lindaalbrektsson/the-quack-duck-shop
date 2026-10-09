import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CartList from "../../components/CartList/CartList";
import CustomerInfoForm, {
  type CustomerFormData,
} from "../../forms/CustomerInfoForm";
import ShippingForm, { type ShippingFormData } from "../../forms/ShippingForm";
import PaymentMethodForm, {
  type PaymentMethodFormData,
} from "../../forms/PaymentMethodForm";
import {
  fetchProducts,
  productsQueryKey,
  productIdQueryKey,
} from "../../api/fetchProducts";
import { updateProductStock } from "../../api/patchProduct";
import { CartContext } from "../../context/CartContext";
import type { CreateOrder, Order } from "../../types/order";
import "./CheckoutPage.css";
function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [checkoutStep, setCheckoutStep] = useState<
    "customer" | "shipping" | "payment"
  >("customer");
  const {
    changeQuantity,
    updateCartItemStock,
    cartItems,
    removeItem,
    totalPrice,
    clearCart,
  } = useContext(CartContext)!;
  const [stockError, setStockError] = useState<string | null>(null);
  const [cartAlert, setCartAlert] = useState("");
  const [cartAlertOpen, setCartAlertOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerFormData | null>(
    null,
  );
  const [shippingInfo, setShippingInfo] = useState<ShippingFormData | null>(
    null,
  );
  const [paymentInfo, setPaymentInfo] = useState<PaymentMethodFormData | null>(
    null,
  );
  const [shippingCost, setShippingCost] = useState(0);
  const handleQuantityChange = async (id: string, change: number) => {
    setStockError(null);
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
        setCartAlert("Oh quack! We couldn't find this duck. 🐥");
        setCartAlertOpen(true);
        return;
      }
      updateCartItemStock(id, product.stock);
      if (cartItem.quantity >= product.stock) {
        setCartAlert(
          `Oh quack! You've already got all available ${product.title}s in your cart! 🐥`,
        );
        setCartAlertOpen(true);
        return;
      }
      changeQuantity(id, change);
    } catch {
      setCartAlert(
        "Oh quack! We couldn't check the duck stock right now. Please try again. 🐥",
      );
      setCartAlertOpen(true);
    }
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
      return {
        isAvailable: false,
        products: null,
      };
    }
    const unavailableItems = cartItems.filter((item) => {
      const currentProduct = products.find((product) => product.id === item.id);

      return !currentProduct || item.quantity > currentProduct.stock;
    });

    if (unavailableItems.length > 0) {
      unavailableItems.forEach((item) => {
        const currentProduct = products.find(
          (product) => product.id === item.id,
        );

        updateCartItemStock(item.id, currentProduct?.stock ?? 0);
      });

      setStockError(
        "Oh quack! Some ducks are no longer available in the requested quantity. We've updated your cart. Please review it and try again. 🐥",
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
      await queryClient.invalidateQueries({
        queryKey: productIdQueryKey(item.productId),
      });
    }
    await queryClient.invalidateQueries({
      queryKey: productsQueryKey,
    });
    clearCart();
    navigate(`/order-confirmation/${orderNumber}`);
  };
  const orderTotal = totalPrice + shippingCost;
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <section className="checkout-page">
      <Snackbar
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
          className="checkout-page__stock-alert"
        >
          {cartAlert}
        </Alert>
      </Snackbar>
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
              <CustomerInfoForm
                onContinue={handleCustomerContinue}
                defaultValues={customerInfo ?? undefined}
              />
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
                defaultValues={shippingInfo ?? undefined}
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
                onPaymentChange={setPaymentInfo}
                defaultValues={paymentInfo ?? undefined}
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
              {isError && (
                <>
                  <Alert
                    severity="warning"
                    variant="filled"
                    className="checkout-page__stock-alert"
                  >
                    Oh quack! We couldn't check the duck stock right now. Please
                    try again. 🐥
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
