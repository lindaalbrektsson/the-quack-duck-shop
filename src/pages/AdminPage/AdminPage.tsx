import { useQuery } from "@tanstack/react-query";
import { fetchProducts, productsQueryKey } from "../../api/products";
import "./AdminPage.css";

function AdminPage() {
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: productsQueryKey,
    queryFn: fetchProducts,
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

              <div>
                <h3>{product.title}</h3>
                <p>Stock: {product.stock}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default AdminPage;
