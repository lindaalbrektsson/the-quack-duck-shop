export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerAddress: string;
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
}

export type CreateOrder = Omit<Order, "id">;