import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchProducts, productsQueryKey } from "../../api/fetchProducts";
import { fetchOrders, ordersQueryKey } from "../../api/fetchOrder";
import { updateProductStock } from "../../api/patchProduct";

import "./AdminPage.css";

function AdminPage() {
  const queryClient = useQueryClient();

  const [stockToAdd, setStockToAdd] = useState<Record<string, number>>({});

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: productsQueryKey,
    queryFn: fetchProducts,
  });

  const {
    data: orders = [],
    isLoading: ordersLoading,
    isError: ordersError,
  } = useQuery({
    queryKey: ordersQueryKey,
    queryFn: fetchOrders,
  });

  const updateStockMutation = useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) =>
      updateProductStock(id, stock),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: productsQueryKey,
      });

      setStockToAdd((current) => {
        const updated = { ...current };
        delete updated[variables.id];
        return updated;
      });
    },
  });

  const lowStockCount = products.filter(
    (product) => product.stock > 0 && product.stock <= 3,
  ).length;

  const outOfStockCount = products.filter(
    (product) => product.stock === 0,
  ).length;

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 3);

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (isError) {
    return <p>Could not load products.</p>;
  }

  return (
    <section className="admin-page">
      <h1>Admin Dashboard</h1>

      {/* Dashboard overview */}
      <section className="admin-overview">
        <h2>Overview</h2>

        <div className="admin-overview__cards">
          <div className="admin-overview__card">
            <h3>Total Orders</h3>
            <p>{ordersLoading || ordersError ? "—" : orders.length}</p>
          </div>

          <div className="admin-overview__card">
            <h3>Total Products</h3>
            <p>{products.length}</p>
          </div>

          <div className="admin-overview__card">
            <h3>Low Stock</h3>
            <p>{lowStockCount}</p>
          </div>

          <div className="admin-overview__card">
            <h3>Out of Stock</h3>
            <p>{outOfStockCount}</p>
          </div>
        </div>
      </section>

      {/* Three most recent orders */}

      <section className="admin-orders">
        <h2>Recent Orders</h2>

        {ordersLoading ? (
          <p>Loading orders...</p>
        ) : ordersError ? (
          <p>Could not load orders.</p>
        ) : recentOrders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <div className="admin-orders__list">
            {recentOrders.map((order) => {
              const itemsTotal = order.items.reduce(
                (total, item) => total + item.price * item.quantity,
                0,
              );

              const orderTotal = itemsTotal + order.shippingCost;

              const totalQuantity = order.items.reduce(
                (total, item) => total + item.quantity,
                0,
              );

              return (
                <details className="admin-orders__item" key={order.id}>
                  <summary className="admin-orders__summary">
                    <div className="admin-orders__info">
                      <h3>{order.orderNumber}</h3>
                      <p>{order.customerName}</p>
                      <p>
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="admin-orders__details">
                      <p>
                        {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
                      </p>
                      <strong>${orderTotal.toFixed(2)}</strong>
                      <span className="admin-orders__arrow">⌄</span>
                    </div>
                  </summary>

                  <div className="admin-orders__products">
                    {order.items.map((item) => {
                      const product = products.find(
                        (product) => product.id === item.productId,
                      );

                      return (
                        <div
                          className="admin-orders__product"
                          key={item.productId}
                        >
                          {product && (
                            <img
                              src={product.images.main}
                              alt={product.title}
                            />
                          )}

                          <div className="admin-orders__product-info">
                            <p>{product?.title ?? "Product unavailable"}</p>
                            <span>
                              {item.quantity} × ${item.price.toFixed(2)}
                            </span>
                          </div>

                          <strong>
                            ${(item.quantity * item.price).toFixed(2)}
                          </strong>
                        </div>
                      );
                    })}

                    <div className="admin-orders__shipping">
                      <span>Shipping</span>
                      <span>${order.shippingCost.toFixed(2)}</span>
                    </div>
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </section>

      {/* Inventory management */}
      <section className="admin-inventory">
        <h2>Inventory</h2>

        <div className="admin-inventory__list">
          {products.map((product) => (
            <article className="admin-inventory__item" key={product.id}>
              <img src={product.images.main} alt={product.title} />

              <div className="admin-inventory__info">
                <h3>{product.title}</h3>

                <div className="admin-inventory__stock">
                  <span>Stock: {product.stock}</span>

                  {product.stock === 0 ? (
                    <span className="admin-inventory__status admin-inventory__status--out">
                      OUT OF STOCK
                    </span>
                  ) : product.stock <= 3 ? (
                    <span className="admin-inventory__status admin-inventory__status--low">
                      LOW STOCK
                    </span>
                  ) : null}
                </div>

                <div className="admin-inventory__stock-control">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    aria-label={`Stock to add for ${product.title}`}
                    value={stockToAdd[product.id] ?? ""}
                    onChange={(event) =>
                      setStockToAdd((current) => ({
                        ...current,
                        [product.id]: Number(event.target.value),
                      }))
                    }
                  />

                  <button
                    type="button"
                    disabled={updateStockMutation.isPending}
                    onClick={() => {
                      const amount = stockToAdd[product.id] ?? 0;

                      if (!Number.isInteger(amount) || amount <= 0) {
                        return;
                      }

                      updateStockMutation.mutate({
                        id: product.id,
                        stock: product.stock + amount,
                      });
                    }}
                  >
                    {updateStockMutation.isPending &&
                    updateStockMutation.variables?.id === product.id
                      ? "Updating..."
                      : "Add stock"}
                  </button>

                  {updateStockMutation.isError &&
                    updateStockMutation.variables?.id === product.id && (
                      <p role="alert">
                        Oh quack! We couldn't update the duck stock. Please try
                        again. 🐥
                      </p>
                    )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default AdminPage;
