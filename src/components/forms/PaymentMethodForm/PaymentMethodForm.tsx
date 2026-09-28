import "../CheckoutForms.css"

const PaymentMethodForm = () => {

    return (
        <>
    <form className="checkout-form">
      <h2>Select Payment Method</h2>

      <label className="shipping-option">
        <input
          type="radio"
          value="Card Payment"
        //   {...register("shippingMethod")}
        //   onChange={handleShippingChange}
        />
        <img
          className="shipping-logo"
          src="/public/payment/Mastercard-logo.png"
          alt="Card Payment"
        />
      </label>

      <label className="shipping-option">
        <input
          type="radio"
          value="DHL"
        //   {...register("shippingMethod")}
        //   onChange={handleShippingChange}
        />
        <img className="shipping-logo" src="/shipping/dhl-logo.png" alt="DHL" />
        <div className="shipping-details">
          <span>4.99</span>
          <span>1-2 days delivery.</span>
        </div>
      </label>

      <label className="shipping-option">
        <input
          type="radio"
          value="BudBee"
        //   {...register("shippingMethod")}
        //   onChange={handleShippingChange}
        />
        <img
          className="shipping-logo"
          src="/shipping/budbee-logo.png"
          alt="BudBee"
        />
        <div className="shipping-details">
          <span>5.99</span>
          <span>1 day delivery.</span>
        </div>
      </label>
</form>
      {/* {errors.shippingMethod && (
        <p role="alert">{errors.shippingMethod.message}</p>
      )}

      <PrimaryButton type="submit">Continue</PrimaryButton> */}
        </>
    )
}

export default PaymentMethodForm