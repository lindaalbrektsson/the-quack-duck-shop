import Rating from "@mui/material/Rating";
import type { Product } from "../../types/product";
import "./ProductCard.css";
import PrimaryButton from "../PrimaryButton/PrimaryButton";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <img
        className="product-card__image"
        src={product.images.main}
        alt={product.title}
      />
      <PrimaryButton>ADD TO CART</PrimaryButton>

      <Rating value={product.rating} precision={0.5} readOnly />

      <h2 className="product-card__title">{product.title}</h2>
    </article>
  );
}

export default ProductCard;
