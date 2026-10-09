import { useContext } from "react";
import type { Product } from "../../types/product";
import { CartContext } from "../../context/CartContext";
import CategoryBadges from "../CategoryBadges/CategoryBadges";
import Rating from "@mui/material/Rating";
import AddToCartButton from "../AddToCartButton/AddToCartButton";
import "./ProductInfo.css";

type Props = {
  product: Product;
};

const ProductInfo = ({ product }: Props) => {
  const displayPrice =
    product.isOnSale && product.salePrice !== null
      ? product.salePrice
      : product.price;

  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error("ProductInfo must be used within a CartProvider");
  }

  const { cartItems } = cartContext;

  const quantityInCart =
    cartItems.find((item) => item.id === product.id)?.quantity ?? 0;

  const availableStock = Math.max(0, product.stock - quantityInCart);

  const isOutOfStock = availableStock === 0;
  const isLowStock = availableStock > 0 && availableStock <= 3;

  return (
    <>
      <div id="title-container">
        <h1>{product.title}</h1>
        <CategoryBadges categories={product.categories} />
      </div>

      <div id="rating-container">
        <Rating value={product.rating} readOnly />
        <p>THROWABILITY RATING</p>
      </div>

      <div id="description-container">
        <p id="description-text">{product.description}</p>

        {!isOutOfStock && (
          <p
            className={
              isLowStock
                ? "product-info__stock product-info__stock--low"
                : "product-info__stock product-info__stock--available"
            }
          >
            {isLowStock ? `ONLY ${availableStock} LEFT IN STOCK!` : "IN STOCK"}
          </p>
        )}
      </div>

      <div id="price-container">
        <AddToCartButton product={product} />

        <div className="product-info__price">
          {product.isOnSale && product.salePrice !== null ? (
            <>
              <span className="sale-price">${displayPrice.toFixed(2)}</span>
              <s className="product-info__original-price">
                ${product.price.toFixed(2)}
              </s>
            </>
          ) : (
            <span>${displayPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductInfo;
