import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PrimaryButton from "../../PrimaryButton/PrimaryButton";
import "../CheckoutForms.css";

// Check that name and address are filled in.
const customerSchema = z.object({
  customerName: z.string().trim().min(2, "Enter your full name"),
  customerAddress: z.string().trim().min(5, "Enter your address"),
});

// Get the form type from the schema.
type CustomerFormData = z.infer<typeof customerSchema>;
type CustomerInfoFormProps = {
  onContinue: (data: CustomerFormData) => void;
};

const CustomerInfoForm = ({ onContinue }: CustomerInfoFormProps) => {
  // Set up the form with Zod validation.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  // Pass valid customer data to the next step.
  const onSubmit = (data: CustomerFormData) => {
    onContinue(data);
  };

  return (
    <form className="checkout-form" onSubmit={handleSubmit(onSubmit)}>
      <h2>Customer Information</h2>

      <div className="checkout-form__field">
        <label htmlFor="customerName">Full Name</label>
        <input id="customerName" type="text" {...register("customerName")} />
      </div>

      {errors.customerName && (
        <p className="checkout-form__error" role="alert">
          {errors.customerName.message}
        </p>
      )}

      <div className="checkout-form__field">
        <label htmlFor="customerAddress">Address</label>
        <input
          id="customerAddress"
          type="text"
          {...register("customerAddress")}
        />
      </div>

      {errors.customerAddress && (
        <p className="checkout-form__error" role="alert">
          {errors.customerAddress.message}
        </p>
      )}

      <PrimaryButton type="submit">Continue to shipping details</PrimaryButton>
    </form>
  );
};

export default CustomerInfoForm;
