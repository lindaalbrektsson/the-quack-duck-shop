import type { Product } from "../../types/product"
import "./ProductGallery.css"

type Props = {
    product: Product
}

const ProductGallery = ({product}: Props) => {
    return (
        <>
        <img id="main-img" src={`${product.images.main}`} alt={`main picture of ${product.title}`} />
        <img id="second-img" src={`${product.images.secondary}`} alt={`secondary picture of ${product.title}`} />
        </>
    )
}

export default ProductGallery