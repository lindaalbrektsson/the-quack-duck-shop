import { useQuery } from "@tanstack/react-query";
import "./ProductListPage.css";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import type { Product, SelectedCategory } from "../../types/product";
import { useState } from "react";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";


function ProductListPage() {
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>("all");

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/products");
      return response.json();
    },
  });

  //filters the product list according to the selectedCategory state. If the state is on all, it just through the whole fetched list, if the state is something else it filters the list. 
  const filteredProducts = 
    selectedCategory === "all"
    ? products
    : products.filter((product) => product.categories.includes(selectedCategory));

  return (
    <section className="product-list-page">
      <div className="product-list-page__header">
        <div className="product-list-page__intro">
          <h1>THE QUACK DUCK SHOP</h1>
          <p>Find your perfect quack. 🐥</p>
        </div>

        <div className="product-list-page__filter">
          <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}/>
        </div>
      </div>

      <ProductGrid products={filteredProducts} />
    </section>
  );
}

export default ProductListPage;
