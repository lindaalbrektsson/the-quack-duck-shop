export interface OrderItem {
    productId: string;
    quantity: number;
    unitPrice: number;
}

export interface Order {
    id: string;
    orderNumber: string;
    customerName: string;
    customerAdress: string;
    shippingMethod: string;
    paymentMethod: string;
    createdAt: string;
    items: OrderItem[];
}