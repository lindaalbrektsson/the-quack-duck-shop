import Rating from "@mui/material/Rating";
import type { Product } from "../../types/product";
import "./ProductCard.css";
import PrimaryButton from "../PrimaryButton/PrimaryButton";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const displayPrice =
    product.isOnSale && product.salePrice !== null
      ? product.salePrice
      : product.price;

  return (
    <article className="product-card">
      <div className="product-card__image-container">
        <img
          className="product-card__image"
          src={product.images.main}
          alt={product.title}
        />
      </div>

      <Rating value={product.rating} precision={0.5} readOnly />

      <h2 className="product-card__title">{product.title}</h2>

      <div className="product-card__bottom">
        <PrimaryButton>ADD TO CART</PrimaryButton>

        <span className="product-card__price">${displayPrice.toFixed(2)}</span>
      </div>
    </article>
  );
}

export default ProductCard;
