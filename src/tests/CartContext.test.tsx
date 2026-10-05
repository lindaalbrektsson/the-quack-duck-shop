import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { useContext } from "react";
import { MemoryRouter } from "react-router-dom";

import { CartContext } from "../context/CartContext";
import { CartProvider } from "../context/CartProvider";
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

const saleProduct: Product = {
  ...testProduct,
  id: "sale-duck",
  title: "Sale Duck",
  price: 20,
  categories: ["onSale"],
  isOnSale: true,
  salePrice: 15,
};

// Connect the product card and cart list for the tests.
function TestCart({ showSaleProduct = false }) {
  const {
    cartItems,
    changeQuantity,
    removeItem,
    totalPrice,
    totalQuantity,
    clearCart,
  } = useContext(CartContext)!;

  return (
    <>
      <ProductCard product={testProduct} />
      {showSaleProduct && <ProductCard product={saleProduct} />}

      <section aria-label="Shopping cart">
        <CartList
          items={cartItems}
          onQuantityChange={changeQuantity}
          onRemove={removeItem}
        />
        <p>Cart quantity: {totalQuantity}</p>
        <p>Cart total: ${totalPrice.toFixed(2)}</p>
        <button type="button" onClick={clearCart}>
          Clear cart
        </button>
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
      </MemoryRouter>,
    );

    // Act
    const addButton = screen.getByRole("button", { name: /add to cart/i });

    await user.click(addButton);
    await user.click(addButton);

    // Assert
    const cart = within(screen.getByRole("region", { name: "Shopping cart" }));

    expect(cart.getAllByRole("listitem")).toHaveLength(1);
    expect(cart.getByText("2")).toBeInTheDocument();
    expect(cart.getByText("Cart total: $20.00")).toBeInTheDocument();
  });

  it("updates quantity and total when clicking plus and minus", async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CartProvider>
          <TestCart />
        </CartProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    const cart = within(screen.getByRole("region", { name: "Shopping cart" }));

    // Act: increase the quantity.
    await user.click(
      cart.getByRole("button", { name: "Increase quantity of Test Duck" }),
    );

    // Assert
    expect(cart.getByText("2")).toBeInTheDocument();
    expect(cart.getByText("Cart total: $20.00")).toBeInTheDocument();

    // Act: decrease the quantity.
    await user.click(
      cart.getByRole("button", { name: "Decrease quantity of Test Duck" }),
    );

    // Assert
    expect(cart.getByText("1")).toBeInTheDocument();
    expect(cart.getByText("Cart total: $10.00")).toBeInTheDocument();
  });

  it("uses the sale price when calculating the cart total", async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CartProvider>
          <TestCart showSaleProduct />
        </CartProvider>
      </MemoryRouter>,
    );

    // Act
    const addButtons = screen.getAllByRole("button", {
      name: /add to cart/i,
    });

    await user.click(addButtons[0]);
    await user.click(addButtons[1]);
    await user.click(addButtons[1]);

    // Assert
    const cart = within(screen.getByRole("region", { name: "Shopping cart" }));

    expect(cart.getAllByRole("listitem")).toHaveLength(2);
    expect(cart.getByText("Cart total: $40.00")).toBeInTheDocument();
  });

  it("removes one product and keeps the other products", async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CartProvider>
          <TestCart showSaleProduct />
        </CartProvider>
      </MemoryRouter>,
    );

    const addButtons = screen.getAllByRole("button", {
      name: /add to cart/i,
    });

    await user.click(addButtons[0]);
    await user.click(addButtons[0]);
    await user.click(addButtons[1]);

    const cart = within(screen.getByRole("region", { name: "Shopping cart" }));

    // Act
    await user.click(
      cart.getByRole("button", { name: "Remove Test Duck from cart" }),
    );

    // Assert
    expect(cart.queryByText("Test Duck")).not.toBeInTheDocument();
    expect(cart.getByText("Sale Duck")).toBeInTheDocument();
    expect(cart.getAllByRole("listitem")).toHaveLength(1);
    expect(cart.getByText("Cart quantity: 1")).toBeInTheDocument();
    expect(cart.getByText("Cart total: $15.00")).toBeInTheDocument();
  });

  it("clears all products from the cart", async () => {
    // Arrange
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CartProvider>
          <TestCart showSaleProduct />
        </CartProvider>
      </MemoryRouter>,
    );

    const addButtons = screen.getAllByRole("button", {
      name: /add to cart/i,
    });

    await user.click(addButtons[0]);
    await user.click(addButtons[1]);

    const cart = within(screen.getByRole("region", { name: "Shopping cart" }));

    // Act
    await user.click(cart.getByRole("button", { name: "Clear cart" }));

    // Assert
    expect(cart.queryAllByRole("listitem")).toHaveLength(0);
    expect(cart.getByText("Your cart is empty.")).toBeInTheDocument();
    expect(cart.getByText("Cart quantity: 0")).toBeInTheDocument();
    expect(cart.getByText("Cart total: $0.00")).toBeInTheDocument();
  });
});
