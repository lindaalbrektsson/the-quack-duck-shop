import type { Product } from "../types/product";

export async function updateProductStock(
    productId: string,
    stock:number,
): Promise<Product> {
    const response = await fetch(
        `http://localhost:3000/products/${productId}`,
        {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({stock,})
        }
    )

    if (!response.ok) {
        throw new Error("Failed to update product stock")
    }

    return response.json()
}