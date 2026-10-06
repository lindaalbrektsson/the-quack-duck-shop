import { useQueries } from "@tanstack/react-query";
import type { Order } from "../../types/order";
import { productIdQueryKey, fetchIdProduct } from "../../api/fetchProducts";
import "./OrderSummary.css";


type OrderProps = {
  order: Order;
};

const OrderSummary = ({ order }: OrderProps) => {

    const productQueries = useQueries({
        queries: order.items.map((item) => ({
            queryKey: productIdQueryKey(item.productId),
            queryFn: () => fetchIdProduct(item.productId),
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
        Got quackit... Your duck order summary couldn't load. Please reload the
        page. 🐥
      </p>
    );
  }

  const productTotal = order.items.reduce((total, item) => {
    return total + item.Price * item.quantity;
  }, 0);

  const totalQuantity = order.items.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  const total = productTotal + order.shippingCost;

  return (
    <section className="order-summary">
      <h2>YOUR ORDER SUMMARY</h2>

      <p className="order-summary__id">
        <strong>ORDER ID:</strong> {order.orderNumber}
      </p>

      <p>{totalQuantity} items</p>

      <ul className="order-list">
        {order.items.map((item, index) => {
          const product = productQueries[index].data;

          return (
            <li key={item.productId} className="order-list__item">
              <img src={product?.images.main} alt={product?.title} />

              <div className="order-list__info">
                <strong>{product?.title}</strong>
                <span>
                  {item.quantity} × ${item.Price.toFixed(2)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="order-receipt">
        <div className="order-receipt__row">
          <strong>Name:</strong>
          <span>{order.customerName}</span>
        </div>

        <div className="order-receipt__row">
          <strong>Address:</strong>
          <span>{order.customerAddress}</span>
        </div>

        <div className="order-receipt__row">
          <strong>Paid with:</strong>
          <span>{order.paymentMethod}</span>
        </div>

        <div className="order-receipt__row">
          <strong>Shipping:</strong>
          <span>{order.shippingMethod}</span>
        </div>

        <div className="order-receipt__row">
          <strong>Shipping fee:</strong>
          <span>${order.shippingCost.toFixed(2)}</span>
        </div>

        <div className="order-receipt__row order-receipt__total">
          <strong>Total:</strong>
          <strong>${total.toFixed(2)}</strong>
        </div>
      </div>
    </section>
  );
};

export default OrderSummary;
