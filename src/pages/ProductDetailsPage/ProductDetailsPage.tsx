import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import type { Product } from "../../types/product";
import ProductInfo from "../../components/ProductInfo/ProductInfo";
import ProductGallery from "../../components/ProductGallery/ProductGallery";
import "./ProductDetailsPage.css";

const ProductDetailsPage = () => {
  const { id } = useParams();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/products/${id}`);
      return response.json();
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!product) {
    return <p>Failed to load the product.</p>;
  }

  return (
    <>
      <Link to="/" className="return-to-shop">
        ← Return to Duck Shop
      </Link>

      <div className="product-details">
        <div>
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
