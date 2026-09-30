import { useQueries } from "@tanstack/react-query"
import type { Order } from "../../types/order"
import type { Product } from "../../types/product"
import "./OrderSummary.css"

type OrderProps = {
    order: Order
}

const OrderSummary = ({order}: OrderProps) => {

const productQueries = useQueries({
        queries: order.items.map((item) => ({
            queryKey: ["product", item.productId],
            queryFn: async () => {
                const response = await fetch(`http://localhost:3000/products/${item.productId}`)

                if (!response.ok) {
                    throw new Error("faild to load product")
                }

                return response.json() as Promise<Product>
            }
        }))
    })
    const isLoading = productQueries.some((query) => query.isLoading)
    const isError = productQueries.some((query) => query.isError)

    if(isLoading) {
        console.log("is loading in order summary")
        return <p>Loading your ducks...</p>
    }
    
    if(isError) {
        console.log("is error in OrderSummary")
        return <p>Got quackit... Your duck order couldn't load. Please try again. 🐥</p>
    }


    const getShippingFee = (shippingMethod: string) => {
        switch (shippingMethod){
            case "DHL":
                return 4.99

            case "PostNord":
                return 3.99

            case "BudBee":
                return 5.99
        }

        return 0
    }

    const productTotal = order.items.reduce((total, item) => {
        return total + item.unitPrice * item.quantity
    }, 0)

    const shippingCost = getShippingFee(order.shippingMethod)

    const total = productTotal + shippingCost

    return (
        <>
        
        
        <div className="order-sum-container">
            <div>
                <h1>YOUR ORDER RESUME</h1>
                <h2>ORDER ID:{order.orderNumber}</h2>
                <p>{order.items.length} articles</p>
                <ul className="order-list">
            {order.items.map((item, index) => {
                const product = productQueries[index].data

                return (
                    <li key={item.productId} className="order-list__item">
                        <img src={product?.images.main} alt={product?.title} />
                        <p>{product?.title}</p>
                        <p>{item.unitPrice}$</p>
                        <p>x{item.quantity}</p>
                    </li>
                )
            })}
            </ul>
            </div>

            <div className="main-receipt-container">
                <div className="receipt-containers">
                    <p>NAME:</p>
                    <p>{order.customerName}</p>
                </div>
                <div className="receipt-containers">
                    <p>ADRESS:</p>
                    <p>{order.customerAddress}</p>
                </div>
                <div className="receipt-containers">
                    <p>PAYED WITH:</p>
                    <p>{order.paymentMethod}</p>
                </div>
                <div className="receipt-containers">
                    <p>SHIPPING:</p>
                    <p>{order.shippingMethod}</p>
                </div>
                <div className="receipt-containers">
                    <p>SHIPPING FEE:</p>
                    <p>{shippingCost}</p>
                </div>
                <div className="receipt-containers">
                    <p className="total-cost">TOTAL:</p>
                    <p className="total-cost">{total.toFixed(2)}$</p>
                </div>
            </div>
        </div>
        </>
    )
}

export default OrderSummary