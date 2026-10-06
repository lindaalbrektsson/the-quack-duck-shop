import type { Product } from "../types/product";

export const productsQueryKey = ["products"] as const;

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch("http://localhost:3000/products");

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function updateProductStock(
  id: string,
  stock: number,
): Promise<Product> {
  const response = await fetch(`http://localhost:3000/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ stock }),
  });

  if (!response.ok) {
    throw new Error("Failed to update product stock");
  }

  return response.json();
}