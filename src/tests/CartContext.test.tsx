import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { useContext } from "react";
import { MemoryRouter } from "react-router-dom";

import { CartContext, CartProvider } from "../context/CartContext";
import ProductCard from "../components/ProductCard/ProductCard";
import CartList from "../components/CartList/CartList";
import type { Product } from "../types/product";

// Start each test with a fresh cart.
afterEach(() => {
  cleanup();
});

const testProduct: Product = {
  id: "test-duck",
  title: "Test Duck",
  description: "A duck used in our tests",
  price: 10,
  categories: [],
  isOnSale: false,
  isLimitedEdition: false,
  salePrice: null,
  images: {
    main: "/ducks/batduck.png",
    secondary: "/ducks/batduck2.png",
  },
  stock: 10,
  rating: 5,
};

// Connect the product card and cart list for the tests.
function TestCart() {
  const { cartItems, changeQuantity, removeItem, totalPrice } =
    useContext(CartContext)!;

  return (
    <>
      <ProductCard product={testProduct} />

      <section aria-label="Shopping cart">
        <CartList
          items={cartItems}
          onQuantityChange={changeQuantity}
          onRemove={removeItem}
        />
        <p>Cart total: ${totalPrice.toFixed(2)}</p>
      </section>
    </>
  );
}

describe("Cart", () => {
  it("adds the same product to one row and increases the quantity", async () => {

    // Arrange
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CartProvider>
          <TestCart />
        </CartProvider>
      </MemoryRouter>
    );

    // Act
    const addButton = screen.getByRole("button", { name: /add to cart/i });

    await user.click(addButton);
    await user.click(addButton);

    // Assert
    const cart = within(
      screen.getByRole("region", { name: "Shopping cart" })
    );

    expect(cart.getAllByRole("listitem")).toHaveLength(1);
    expect(cart.getByText("2")).toBeInTheDocument();
    expect(cart.getByText("Cart total: $20.00")).toBeInTheDocument();
  });
});