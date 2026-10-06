import type { Product } from "../types/product";


//For all products
export const productsQueryKey = ["products"] as const;

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch("http://localhost:3000/products");

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

//For specific products
export const productIdQueryKey = (productId: string) => 
  ["product", productId] as const;

export async function fetchProductById(
  productId: string,
): Promise<Product> {
  const response = await fetch (
    `http://localhost:3000/products/${productId}`
  );

  if (!response.ok) {
    throw new Error ("Failed to load product")
  }

  return response.json();
}