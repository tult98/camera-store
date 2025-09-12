import { HttpTypes } from "@medusajs/types"
import FormInput from "@modules/common/components/form-input"
import { useFormContext } from "react-hook-form"

export interface ShippingAddressFormData extends HttpTypes.StoreUpdateCart {
  shipping_address?: HttpTypes.StoreAddAddress
}

const ShippingAddress = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ShippingAddressFormData>()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="First Name"
          {...register("shipping_address.first_name", {
            required: "First name is required",
          })}
          error={errors.shipping_address?.first_name}
          autoComplete="given-name"
          required
          data-testid="shipping-first-name-input"
        />

        <FormInput
          label="Last Name"
          {...register("shipping_address.last_name", {
            required: "Last name is required",
          })}
          error={errors.shipping_address?.last_name}
          autoComplete="family-name"
          required
          data-testid="shipping-last-name-input"
        />
      </div>

      <FormInput
        label="Email"
        type="email"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Please enter a valid email address",
          },
        })}
        error={errors.email}
        autoComplete="email"
        required
        data-testid="shipping-email-input"
      />

      <FormInput
        label="Phone Number"
        type="tel"
        {...register("shipping_address.phone", {
          required: "Phone number is required",
        })}
        error={errors.shipping_address?.phone}
        autoComplete="tel"
        required
        data-testid="shipping-phone-input"
      />

      <FormInput
        label="Address 1"
        {...register("shipping_address.address_1", {
          required: "Address is required",
        })}
        error={errors.shipping_address?.address_1}
        placeholder="House number, street name, etc."
        helperText="Primary street address (e.g., 123 Main Street)"
        autoComplete="address-line1"
        required
        data-testid="shipping-address-1-input"
      />

      <FormInput
        label="Address 2"
        {...register("shipping_address.address_2")}
        error={errors.shipping_address?.address_2}
        placeholder="Apartment, suite, unit, etc."
        helperText="Optional: Apartment, suite, unit, building, floor, etc."
        autoComplete="address-line2"
        data-testid="shipping-address-2-input"
      />

      <FormInput
        label="City"
        {...register("shipping_address.city", {
          required: "City is required",
        })}
        error={errors.shipping_address?.city}
        autoComplete="address-level2"
        required
        data-testid="shipping-city-input"
      />
    </div>
  )
}

export default ShippingAddress
