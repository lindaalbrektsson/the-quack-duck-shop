import Rating from "@mui/material/Rating";
import type { Product } from "../../types/product";
import "./ProductCard.css";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import CategoryBadges from "../CategoryBadges/CategoryBadges";
import { Link } from "react-router-dom";

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
        <CategoryBadges categories={product.categories} />
      </div>

      <h2 className="product-card__title">{product.title}</h2>

      <div className="product-card__bottom">
        <PrimaryButton>ADD TO CART</PrimaryButton>

        <span className="product-card__price">${displayPrice.toFixed(2)}</span>
      </div>
    </Link>
    </article>
  );
}

export default ProductCard;
