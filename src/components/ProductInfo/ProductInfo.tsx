import type { Product } from "../../types/product";
import CategoryBadges from "../CategoryBadges/CategoryBadges";
import Rating from "@mui/material/Rating";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import "./ProductInfo.css"

type Props = {
  product: Product;
};
const ProductInfo = ({ product }: Props) => {
  const { addToCart } = useContext(CartContext)!;
  
  const displayPrice =
    product.isOnSale && product.salePrice !== null
      ? product.salePrice
      : product.price;
  return (
    <>
      <div id="title-container">
      <h1>{product.title}</h1>
        <CategoryBadges categories={product.categories}/>
      </div>
      <div id="rating-container">
        <Rating value={product.rating} readOnly />
        <p>THROWABILITY RATING</p>
      </div>
      <div id="description-container">
        <p id="description-text">{product.description}</p>
        <p>STOCK STATUS</p> {/*Hard coded stock status for know*/}
      </div>
      <div id="price-container">
        <PrimaryButton onClick={() => addToCart(product)}>
          ADD TO CART
        </PrimaryButton>
        <h1>{`${displayPrice}$`}</h1>
      </div>
    </>
  );
};

export default ProductInfo;
