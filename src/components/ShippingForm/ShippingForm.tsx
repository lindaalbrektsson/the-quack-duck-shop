import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PrimaryButton from "../PrimaryButton/PrimaryButton";
import "./ShippingForm.css";

const shippingSchema = z.object({
  shippingMethod: z
    .string({
      error: "Please select a shipping method.",
    })
    .min(1, "Please select a shipping method."),
});

type ShippingFormValues = z.infer<typeof shippingSchema>;

export type ShippingFormData = {
  shippingMethod: string;
  shippingCost: number;
};

type ShippingFormProps = {
  onContinue: (data: ShippingFormData) => void;
};

const shippingCosts = {
  DHL: 4.99,
  PostNord: 3.99,
  BudBee: 5.99,
};

const ShippingForm = ({ onContinue }: ShippingFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
  });

  const onSubmit = (data: ShippingFormValues) => {
    const shippingCost =
      shippingCosts[data.shippingMethod as keyof typeof shippingCosts];

    onContinue({
      shippingMethod: data.shippingMethod,
      shippingCost,
    });
  };

  return (
    <form className="shipping-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>Select Shipping</h2>

      <label className="shipping-option">
        <input type="radio" value="PostNord" {...register("shippingMethod")} />
        <img
          className="shipping-logo"
          src="/shipping/postnord-logo.png"
          alt="PostNord"
        />
        <div className="shipping-details">
          <span>3.99</span>
          <span>3-5 days delivery.</span>
        </div>
      </label>

      <label className="shipping-option">
        <input type="radio" value="DHL" {...register("shippingMethod")} />
        <img className="shipping-logo" src="/shipping/dhl-logo.png" alt="DHL" />

        <div className="shipping-details">
          <span>4.99</span>
          <span>1-2 days delivery.</span>
        </div>
      </label>

      <label className="shipping-option">
        <input type="radio" value="BudBee" {...register("shippingMethod")} />
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

      {errors.shippingMethod && (
        <p role="alert">{errors.shippingMethod.message}</p>
      )}

      <PrimaryButton type="submit">Continue</PrimaryButton>
    </form>
  );
};

export default ShippingForm;
