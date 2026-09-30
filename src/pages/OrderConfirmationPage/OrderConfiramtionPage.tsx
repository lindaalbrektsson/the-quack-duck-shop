import { useNavigate, useParams } from "react-router-dom"
import OrderSummary from "../../components/OrderSummary/OrderSummary"
import { useQuery } from "@tanstack/react-query";
import type { Order } from "../../types/order";
import "./OrderConfirmationPage.css"
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
const OrderConfirmationPage = () => {

    const navigate = useNavigate()
    const { orderNumber } = useParams()
    
    const {
        data: order,
        isLoading,
        isError,
    } = useQuery<Order>({
        queryKey: ["order", orderNumber],
        queryFn: async () => {
            const response = await fetch (`http://localhost:3000/orders?orderNumber=${orderNumber}`)

            if (!response.ok) {
                throw new Error("Faild to load order!")
            }

            const orderData: Order[] = await response.json()

            return orderData[0]
        }
    })

    if (isLoading) {
        return <p>We are preparing your quacky order! 🐥</p>
    }

    if (isError) {
        return <p>Got quackit... Your duck order couldn't load.
            Please try again. 🐥 </p>
    }

    if (!order) {
        return <p>Got quackit... We can't find your duck order. 🦆💨 </p>
    }

    return (
    <div className="Order-confirmation-container">
        <div className="title-container">
            <h1>Thank you {order.customerName} for your order!</h1>
            <h1>It has been sucessfully placed</h1>
        </div>
        <OrderSummary order={order}/>
        <div className="return-btn">
            <PrimaryButton onClick={() => navigate("/")}>RETURN TO DUCK SHOP</PrimaryButton>
        </div>
    </div>
    )
}

export default OrderConfirmationPage