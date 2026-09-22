import type { Product } from "../../types/product";
import CategoryBadges from "../CategoryBadges/CategoryBadges";
import Rating from "@mui/material/Rating";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

type Props = {
  product: Product;
};

const ProductInfo = ({ product }: Props) => {
  const { addToCart } = useContext(CartContext)!;

  return (
    <>
      <h1>{product.title}</h1>
      <div>
        <CategoryBadges categories={product.categories} />
      </div>
      <div>
        <Rating value={product.rating} readOnly />
        <p>THROWABILITY RATING</p>
      </div>
      <div>
        <p>{product.description}</p>
        <p>STOCK STATUS</p> {/*Hard coded stock status for know*/}
      </div>
      <div>
        <PrimaryButton onClick={() => addToCart(product)}>
          ADD TO CART
        </PrimaryButton>
        <h1>{`${product.price}$`}</h1>
      </div>
    </>
  );
};

export default ProductInfo;
