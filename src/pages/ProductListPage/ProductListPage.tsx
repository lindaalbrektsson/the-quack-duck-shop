import { useQuery } from "@tanstack/react-query";
import "./ProductListPage.css";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import type { Product, SelectedCategory } from "../../types/product";
import { useSearchParams } from "react-router-dom";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";

function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get(
    "category",
  ) as SelectedCategory | null;

  const selectedCategory: SelectedCategory = categoryFromUrl ?? "all";

  const setSelectedCategory = (category: SelectedCategory) => {
    if (category === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/products");

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      return response.json();
    },
  });

  if (isLoading) {
    return <p>Getting the ducks in a row... 🐥</p>;
  }

  if (isError) {
    return <p>Oh quack! We couldn't load the ducks. Please try again. 🐥</p>;
  }

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) =>
          product.categories.includes(selectedCategory),
        );

  return (
    <section className="product-list-page">
      <div className="product-list-page__header">
        <div className="product-list-page__intro">
          <h1>THE QUACK DUCK SHOP</h1>
          <p>Find your perfect quack. 🐥</p>
        </div>

        <div className="product-list-page__filter">
          <CategoryFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>
      </div>

      <ProductGrid products={filteredProducts} />
    </section>
  );
}

export default ProductListPage;
