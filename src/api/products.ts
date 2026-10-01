import type { Product } from "../types/product";

export const productsQueryKey = ["products"] as const;

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch("http://localhost:3000/products");

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}