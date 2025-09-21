import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, Input, Label } from "./UI";
import { Loader2, AlertCircle } from "lucide-react";

const schema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "First name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Last name can only contain letters, spaces, hyphens, and apostrophes"
    ),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .regex(
      /^[\d\s\-\(\)]+$/,
      "Phone number can only contain digits, spaces, hyphens, and parentheses"
    )
    .refine((val) => {
      const cleanPhone = val.replace(/[\s\-\(\)]/g, "");
      return cleanPhone.length >= 10 && cleanPhone.length <= 15;
    }, "Please enter a valid phone number"),
});

export default function CustomerForm({
  defaultValues,
  onSubmit,
  submitting,
  error,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    watch,
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const watchedValues = watch();

  return (
    <Card>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="firstName"
              className="text-sm font-medium text-gray-700"
            >
              First Name *
            </Label>
            <Input
              id="firstName"
              {...register("firstName")}
              className={`mt-1 ${
                errors.firstName ? "border-red-300 focus:ring-red-500" : ""
              }`}
              placeholder="Enter first name"
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="lastName"
              className="text-sm font-medium text-gray-700"
            >
              Last Name *
            </Label>
            <Input
              id="lastName"
              {...register("lastName")}
              className={`mt-1 ${
                errors.lastName ? "border-red-300 focus:ring-red-500" : ""
              }`}
              placeholder="Enter last name"
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle size={12} />
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label
            htmlFor="phoneNumber"
            className="text-sm font-medium text-gray-700"
          >
            Phone Number *
          </Label>
          <Input
            id="phoneNumber"
            {...register("phoneNumber")}
            className={`mt-1 ${
              errors.phoneNumber ? "border-red-300 focus:ring-red-500" : ""
            }`}
            placeholder="Enter phone number"
            type="tel"
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle size={12} />
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={submitting || !isValid || !isDirty}
            className="flex items-center gap-2"
          >
            {submitting && <Loader2 className="animate-spin" size={16} />}
            {submitting ? "Saving..." : "Save Customer"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
