import Rating from "@mui/material/Rating";
import type { Product } from "../../types/product";
import "./ProductCard.css";
import CategoryBadges from "../CategoryBadges/CategoryBadges";
import { Link } from "react-router-dom";
import AddToCartButton from "../AddToCartButton/AddToCartButton";

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
      <Link to={`/products/${product.id}`}>
        <div className="product-card__image-container">
          <img
            className="product-card__image"
            src={product.images.main}
            alt={product.title}
          />
        </div>

        <div className="product-card__info">
          <Rating value={product.rating} readOnly />
        </div>

        <h2 className="product-card__title">{product.title}</h2>
      </Link>

      <CategoryBadges categories={product.categories} />

      <div className="product-card__bottom">
        <AddToCartButton product={product} />

        <span
          className={
            product.isOnSale && product.salePrice !== null
              ? "product-card__price sale-price"
              : "product-card__price"
          }
        >
          ${displayPrice.toFixed(2)}
        </span>
      </div>
    </article>
  );
}

export default ProductCard;
