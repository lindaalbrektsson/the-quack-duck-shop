import { useQuery } from "@tanstack/react-query";
import "./ProductListPage.css";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import type { Product } from "../../types/product";

function ProductListPage() {
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/products");
      return response.json();
    },
  });

  return (
    <section className="product-list-page">
      <div className="product-list-page__header">
        <div className="product-list-page__intro">
          <h1>THE QUACK DUCK SHOP</h1>
          <p>Find your perfect quack. 🐥</p>
        </div>

        <div className="product-list-page__filter">
          <p>Filter here</p>
        </div>
      </div>

      <ProductGrid products={products} />
    </section>
  );
}

export default ProductListPage;
