import "./CheckoutForms.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import PrimaryButton from "../components/PrimaryButton/PrimaryButton";

const paymentMethodSchema = z.object({
  paymentMethod: z.enum(["Card Payment", "Swish", "Klarna"], {
    message: "Please select a payment method",
  }),
});

export type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

type PaymentMethodFormProps = {
  onContinue: (data: PaymentMethodFormData) => void;
  isPending: boolean;
  isFetching: boolean;
};

const PaymentMethodForm = ({
  onContinue,
  isPending,
  isFetching,
}: PaymentMethodFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
  });

  const onSubmit = (data: PaymentMethodFormData) => {
    onContinue({
      paymentMethod: data.paymentMethod,
    });
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>Select Payment Method</h2>

      <label className="shipping-option">
        <input
          type="radio"
          value="Card Payment"
          {...register("paymentMethod")}
        />
        <img
          className="shipping-logo"
          src="/payment/Mastercard-logo.png"
          alt="Card Payment"
        />
        <div className="shipping-details">
          <span>Card Payment</span>
        </div>
      </label>

      <label className="shipping-option">
        <input type="radio" value="Swish" {...register("paymentMethod")} />
        <img
          className="shipping-logo"
          src="/payment/Swish-logo.png"
          alt="Swish"
        />
        <div className="shipping-details">
          <span>Swish</span>
        </div>
      </label>

      <label className="shipping-option">
        <input type="radio" value="Klarna" {...register("paymentMethod")} />
        <img
          className="shipping-logo"
          src="/payment/Klarna-logo.png"
          alt="Klarna"
        />
        <div className="shipping-details">
          <span>Klarna</span>
        </div>
      </label>

      {errors.paymentMethod && (
        <p role="alert">{errors.paymentMethod.message}</p>
      )}

      <PrimaryButton type="submit" disabled={isPending || isFetching}>
        {isPending || isFetching ? "LOADING..." : "PLACE ORDER"}
      </PrimaryButton>
    </form>
  );
};

export default PaymentMethodForm;
