import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import type { Product } from "../../types/product"
import ProductInfo from "../../components/ProductInfo/ProductInfo"
import ProductGallery from "../../components/ProductGallery/ProductGallery"

 
const ProductDetailsPage = () => {
    const { id } = useParams()

    const {data: product, isLoading} = useQuery<Product>({
        queryKey: ["product", id],
        queryFn: async () => {
            const response = await fetch(`http://localhost:3000/products/${id}`)
            return response.json()
        },
    })

    if (isLoading) {
        return <p>Loading...</p>
    }

    if (!product) {
        return <p>Failed to load the product.</p>
    }

    return (
        <>
        <div>
            <ProductInfo product={product}/>
        </div>
        <div>
            <ProductGallery product={product}/>
        </div>
        </>
    )
}

export default ProductDetailsPage