import { useQuery } from "@tanstack/react-query";
import "./ProductListPage.css";
import ProductGrid from "../../components/ProductGrid/ProductGrid";
import type { Product, SelectedCategory } from "../../types/product";
import { useSearchParams } from "react-router-dom";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
import { fetchProducts, productsQueryKey } from "../../api/products";

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
    queryKey: productsQueryKey,
    queryFn: fetchProducts,
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
