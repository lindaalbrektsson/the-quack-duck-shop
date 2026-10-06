import { useNavigate, useParams } from "react-router-dom";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import { useQuery } from "@tanstack/react-query";
import type { Order } from "../../types/order";
import "./OrderConfirmationPage.css";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";

import { orderQueryKey, fetchOrder } from "../../api/fetchOrder";

const OrderConfirmationPage = () => {

  const navigate = useNavigate();
  const { orderNumber } = useParams();

  const {
    data: order,
    isLoading,
    isError,
    } = useQuery<Order | null>({
        queryKey: orderQueryKey(orderNumber),
        queryFn: () => fetchOrder(orderNumber!),
        enabled: !!orderNumber,
    });

  if (isLoading) {
    return <p>We are preparing your quacky order! 🐥</p>;
  }

  if (isError) {
    return (
      <p>Got quackit... Your duck order couldn't load. Please try again. 🐥 </p>
    );
  }

  if (!order) {
    return <p>Got quackit... We can't find your duck order. 🦆💨 </p>;
  }

  return (
    <div className="order-confirmation-container">
      <div className="order-confirmation__title">
        <h1>Thank you {order.customerName} for your order!</h1>
        <p>It has been successfully placed.</p>
      </div>

      <OrderSummary order={order} />

      <div className="order-confirmation__return">
        <PrimaryButton onClick={() => navigate("/")}>
          RETURN TO DUCK SHOP
        </PrimaryButton>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
