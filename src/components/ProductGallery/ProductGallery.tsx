import type { Product } from "../../types/product"

type Props = {
    product: Product
}

const ProductGallery = ({product}: Props) => {
    return (
        <>
        <img src={`${product.images.main}`} alt={`main picture of ${product.title}`} />
        <img src={`${product.images.secondary}`} alt={`secondary picture of ${product.title}`} />
        </>
    )
}

export default ProductGallery