import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import type { Product } from "../../types/product";
import ProductInfo from "../../components/ProductInfo/ProductInfo";
import ProductGallery from "../../components/ProductGallery/ProductGallery";
import "./ProductDetailsPage.css";

const ProductDetailsPage = () => {
  const { id } = useParams();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/products/${id}`);

      if (!response.ok) {
        throw new Error("Failed to load product");
      }

      return response.json();
    },
  });

  if (isLoading) {
    return <p>Just a quack... finding your duck! 🐥</p>;
  }

  if (isError) {
    return <p>Oh quack! We couldn't load this duck. Please try again. 🐥</p>;
  }

  if (!product) {
    return <p>Oh quack! This duck seems to have waddled away. 🦆💨</p>;
  }

  return (
    <>
      <Link to="/" className="return-to-shop">
        ← Return to Duck Shop
      </Link>

      <div className="product-details">
        <div className="product-details__info">
          <ProductInfo product={product} />
        </div>

        <div className="product-details__gallery">
          <ProductGallery product={product} />
        </div>
      </div>
    </>
  );
};

export default ProductDetailsPage;
