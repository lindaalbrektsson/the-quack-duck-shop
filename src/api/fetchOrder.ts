import type { Order } from "../types/order";

export const orderQueryKey = (orderNumber: string | undefined) => 
    ["order", orderNumber] as const;

export async function fetchOrder(
    orderNumber: string,
): Promise<Order | null> {
    const response = await fetch(
        `http://localhost:3000/orders?orderNumber=${orderNumber}`
    )

    if (!response.ok) {
        throw new Error("Failed to load order!")
    }
    
    const orderData: Order[] = await response.json();
    
    if (orderData.length === 0) {
        return null;
    }

    return orderData[0]
};
