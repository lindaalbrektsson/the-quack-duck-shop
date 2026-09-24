import CustomerInfoForm from "../../components/CustomerInfoForm/CustomerInfoForm";
import "./CheckoutPage.css";

function CheckoutPage() {
  const handleCustomerContinue = () => {
    // Checkout step logic will be added later.
  };

  return (
    <section className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-page__layout">
        <div className="checkout-page__main">
          <CustomerInfoForm onContinue={handleCustomerContinue} />
        </div>

        <aside className="checkout-page__summary">
          <h2>Your Order Resume</h2>
          <p>0 articles</p>

          <div className="checkout-page__summary-total">
            <strong>Total:</strong>
            <strong>$0.00</strong>
          </div>

          <div className="checkout-page__shipping">
            <span>Standard shipping fee</span>
            <span>$0.00</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default CheckoutPage;
