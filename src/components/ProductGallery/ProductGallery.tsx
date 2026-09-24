import type { Product } from "../../types/product";
import "./ProductGallery.css";
import { useState } from "react";

type Props = {
  product: Product;
};

const ProductGallery = ({ product }: Props) => {
  const [isSwapped, setIsSwapped] = useState(false);

  return (
    <>
      <img
        id="main-img"
        src={isSwapped ? product.images.secondary : product.images.main}
        alt={`Product view of ${product.title}`}
      />
      <button
        type="button"
        className="product-gallery__thumbnail"
        aria-label="Switch product images"
        onClick={() => setIsSwapped((previous) => !previous)}
      >
        <img
          id="second-img"
          src={isSwapped ? product.images.main : product.images.secondary}
          alt={`Alternative view of ${product.title}`}
        />
      </button>
    </>
  );
};

export default ProductGallery;
