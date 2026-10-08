
import type { Order } from "../types/order";

// Fetch a specific order
export const orderQueryKey = (orderNumber: string | undefined) =>
  ["order", orderNumber] as const;

export async function fetchOrder(
  orderNumber: string,
): Promise<Order | null> {
  const response = await fetch(
    `http://localhost:3000/orders?orderNumber=${encodeURIComponent(orderNumber)}`,
  );

  if (!response.ok) {
    throw new Error("Failed to load order!");
  }

  const orderData: Order[] = await response.json();

  if (orderData.length === 0) {
    return null;
  }

  return orderData[0];
}

// Fetch all orders
export const ordersQueryKey = ["orders"] as const;

export async function fetchOrders(): Promise<Order[]> {
  const response = await fetch("http://localhost:3000/orders");

  if (!response.ok) {
    throw new Error("Failed to load orders!");
  }

  return response.json();
}
