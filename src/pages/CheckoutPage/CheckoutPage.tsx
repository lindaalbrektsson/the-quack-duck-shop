import { useState } from "react";

import CartList from "../../components/CartList/CartList";
import CustomerInfoForm from "../../components/forms/CustomerInfoForm/CustomerInfoForm";
import ShippingForm, {
  type ShippingFormData,
} from "../../components/forms/ShippingForm/ShippingForm";
import type { CartItem } from "../../types/product";
// TODO: Add when PaymentForm has been created.
// import PaymentForm from "../../components/forms/PaymentForm/PaymentForm";
import "./CheckoutPage.css";

// Temporary cart data until CartContext is connected.
// Copying the existing exampleItems from CartDrawer.
const exampleItems: CartItem[] = [
  {
    id: "duck-001",
    title: "Al Capone Duck",
    description: "An example product",
    price: 14.99,
    categories: ["onSale"],
    isOnSale: true,
    isLimitedEdition: false,
    salePrice: 9.99,
    images: {
      main: "/ducks/alcaponeduck.png",
      secondary: "/ducks/alcaponeduck2.png",
    },
    stock: 10,
    rating: 3,
    quantity: 1,
  },
  {
    id: "duck-002",
    title: "Bat Duck",
    description: "The bathtub needs a hero.",
    price: 16.99,
    categories: ["mostPopular"],
    isOnSale: false,
    isLimitedEdition: false,
    salePrice: null,
    images: {
      main: "/ducks/batduck.png",
      secondary: "/ducks/batduck2.png",
    },
    stock: 15,
    rating: 5,
    quantity: 1,
  },
  {
    id: "duck-003",
    title: "Beer Duck",
    description: "Clock out and float away.",
    price: 12.99,
    categories: [],
    isOnSale: false,
    isLimitedEdition: false,
    salePrice: null,
    images: {
      main: "/ducks/beerduck.png",
      secondary: "/ducks/beerduck2.png",
    },
    stock: 12,
    rating: 2,
    quantity: 1,
  },
];

function CheckoutPage() {
  const [checkoutStep, setCheckoutStep] = useState<
    "customer" | "shipping" | "payment"
  >("customer");

  const [shippingCost, setShippingCost] = useState(0);

  // TODO: Replace local items state with CartContext when it is connected.
  const [items, setItems] = useState<CartItem[]>(exampleItems);

  const changeQuantity = (id: string, change: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const handleCustomerContinue = () => {
    setCheckoutStep("shipping");
  };

  const handleShippingContinue = (data: ShippingFormData) => {
    setShippingCost(data.shippingCost);
    setCheckoutStep("payment");
  };

  const totalPrice = items.reduce((total, item) => {
    const price =
      item.isOnSale && item.salePrice !== null ? item.salePrice : item.price;

    return total + price * item.quantity;
  }, 0);

  const orderTotal = totalPrice + shippingCost;

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-page__layout">
        <div className="checkout-page__main">
          {checkoutStep === "customer" && (
            <>
              <CartList
                items={items}
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
          {/* TODO: Replace this with PaymentForm when it has been created.
          Also add the PaymentForm import at the top of this file. */}
          {checkoutStep === "payment" && <p>Payment form coming soon.</p>}
        </div>
        <aside className="checkout-page__summary">
          <h2>Your Order Resume</h2>

          {checkoutStep === "customer" && (
            <>
              <p>{totalQuantity} articles</p>

              <div className="checkout-page__summary-items">
                {items.map((item) => {
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

          {checkoutStep !== "customer" && <CartList items={items} readOnly />}

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
