import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fetchProducts, productsQueryKey } from "../../api/fetchProducts";

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

  const updateStockMutation = useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) =>
      updateProductStock(id, stock),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productsQueryKey,
      });
    },
  });

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (isError) {
    return <p>Could not load products.</p>;
  }

  return (
    <section className="admin-page">
      <h1>Admin Dashboard</h1>

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
                    onClick={() => {
                      const amount = stockToAdd[product.id] ?? 0;

                      if (amount <= 0) {
                        return;
                      }

                      updateStockMutation.mutate({
                        id: product.id,
                        stock: product.stock + amount,
                      });
                    }}
                  >
                    Add stock
                  </button>
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
