import { useQueries } from "@tanstack/react-query";
import type { Order } from "../../types/order";
import type { Product } from "../../types/product";
import "./OrderSummary.css";

type OrderProps = {
  order: Order;
};

const OrderSummary = ({ order }: OrderProps) => {
  const productQueries = useQueries({
    queries: order.items.map((item) => ({
      queryKey: ["product", item.productId],
      queryFn: async () => {
        const response = await fetch(
          `http://localhost:3000/products/${item.productId}`,
        );

        if (!response.ok) {
          throw new Error("faild to load product");
        }

        return response.json() as Promise<Product>;
      },
    })),
  });
  const isLoading = productQueries.some((query) => query.isLoading);
  const isError = productQueries.some((query) => query.isError);

  if (isLoading) {
    return <p>Loading your ducks...</p>;
  }

  if (isError) {
    return (
      <p>
        Got quackit... Your duck order summary couldn't load. Please try reload
        the page. 🐥
      </p>
    );
  }

  const productTotal = order.items.reduce((total, item) => {
    return total + item.unitPrice * item.quantity;
  }, 0);

  const totalQunatity = order.items.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  const total = productTotal + order.shippingCost;

  return (
    <>
      <div className="order-sum-container">
        <div>
          <h1>YOUR ORDER SUMMARY</h1>
          <h2>ORDER ID:{order.orderNumber}</h2>
          <p>{totalQunatity} items</p>
          <ul className="order-list">
            {order.items.map((item, index) => {
              const product = productQueries[index].data;

              return (
                <li key={item.productId} className="order-list__item">
                  <img src={product?.images.main} alt={product?.title} />
                  <p>{product?.title}</p>
                  <p>${item.unitPrice.toFixed(2)}</p>
                  <p>x{item.quantity}</p>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="main-receipt-container">
          <div className="receipt-containers">
            <p>NAME:</p>
            <p>{order.customerName}</p>
          </div>
          <div className="receipt-containers">
            <p>ADDRESS:</p>
            <p>{order.customerAddress}</p>
          </div>
          <div className="receipt-containers">
            <p>PAID WITH:</p>
            <p>{order.paymentMethod}</p>
          </div>
          <div className="receipt-containers">
            <p>SHIPPING:</p>
            <p>{order.shippingMethod}</p>
          </div>
          <div className="receipt-containers">
            <p>SHIPPING FEE:</p>
            <p>${order.shippingCost.toFixed(2)}</p>
          </div>
          <div className="receipt-containers">
            <p className="total-cost">TOTAL:</p>
            <p className="total-cost">${total.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSummary;
