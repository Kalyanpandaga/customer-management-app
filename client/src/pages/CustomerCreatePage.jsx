import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createCustomer } from "../services/customers";
import CustomerForm from "../components/CustomerForm";
import toast from "react-hot-toast";

export default function CustomerCreatePage() {
  const nav = useNavigate();
  const m = useMutation({
    mutationFn: createCustomer,
    onSuccess: (res) => {
      toast.success("Customer created");
      nav(`/customers/${res.id}`);
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New Customer</h1>
      <CustomerForm
        defaultValues={{ firstName: "", lastName: "", phoneNumber: "" }}
        submitting={m.isPending}
        onSubmit={(values) => m.mutate(values)}
      />
    </div>
  );
}
