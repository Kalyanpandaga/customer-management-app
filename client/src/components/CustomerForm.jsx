import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Input, Label } from "./UI";

const schema = z.object({
  firstName: z.string().min(2).max(30),
  lastName: z.string().min(2).max(30),
  phoneNumber: z.string().min(8),
});

export default function CustomerForm({ defaultValues, onSubmit, submitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  return (
    <Card>
      <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" {...register("firstName")} />
          {errors.firstName && (
            <p className="text-xs text-red-600">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" {...register("lastName")} />
          {errors.lastName && (
            <p className="text-xs text-red-600">{errors.lastName.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input id="phoneNumber" {...register("phoneNumber")} />
          {errors.phoneNumber && (
            <p className="text-xs text-red-600">{errors.phoneNumber.message}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting}>
            Save
          </Button>
        </div>
      </form>
    </Card>
  );
}
