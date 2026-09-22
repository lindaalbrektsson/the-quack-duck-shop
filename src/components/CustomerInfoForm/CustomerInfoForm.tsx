import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PrimaryButton from "../PrimaryButton/PrimaryButton";

// Check that name and address are filled in.
const customerSchema = z.object({
  customerName: z.string().trim().min(2, "Enter your full name"),
  customerAddress: z.string().trim().min(5, "Enter your address"),
});

// Get the form type from the schema.
type CustomerFormData = z.infer<typeof customerSchema>;

const CustomerInfoForm = () => {
  // Set up the form with Zod validation.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  });

  // Log the form data for now.
  const onSubmit = (data: CustomerFormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Customer Information</h2>
      <label htmlFor="customerName">Full Name</label>
      <input id="customerName" type="text" {...register("customerName")} />
      {/* Show an error if the name is too short. */}
      {errors.customerName && <p role="alert">{errors.customerName.message}</p>}
      <label htmlFor="customerAddress">Address</label>
      <input
        id="customerAddress"
        type="text"
        {...register("customerAddress")}
      />
      {/* Show an error if the address is too short. */}
      {errors.customerAddress && (
        <p role="alert">{errors.customerAddress.message}</p>
      )}
      <PrimaryButton type="submit">Continue</PrimaryButton>
    </form>
  );
};

export default CustomerInfoForm;
