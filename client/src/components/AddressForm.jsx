import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Input, Label } from "./UI";

const schema = z.object({
  addressDetails: z.string().min(5).max(100),
  city: z.string().min(2).max(50),
  state: z.string().min(2).max(50),
  pinCode: z.string().min(3),
});

export default function AddressForm({ defaultValues, onSubmit, submitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues, resolver: zodResolver(schema) });

  return (
    <Card>
      <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="addressDetails">Address</Label>
          <Input id="addressDetails" {...register("addressDetails")} />
          {errors.addressDetails && (
            <p className="text-xs text-red-600">
              {errors.addressDetails.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register("city")} />
            {errors.city && (
              <p className="text-xs text-red-600">{errors.city.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input id="state" {...register("state")} />
            {errors.state && (
              <p className="text-xs text-red-600">{errors.state.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="pinCode">PIN</Label>
            <Input id="pinCode" {...register("pinCode")} />
            {errors.pinCode && (
              <p className="text-xs text-red-600">{errors.pinCode.message}</p>
            )}
          </div>
        </div>
        <div>
          <Button type="submit" disabled={submitting}>
            Save
          </Button>
        </div>
      </form>
    </Card>
  );
}
