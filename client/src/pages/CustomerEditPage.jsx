import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCustomer, updateCustomer } from "../services/customers";
import CustomerForm from "../components/CustomerForm";
import toast from "react-hot-toast";

export default function CustomerEditPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomer(id),
  });

  const m = useMutation({
    mutationFn: (vals) => updateCustomer(id, vals),
    onSuccess: () => {
      toast.success("Customer updated");
      qc.invalidateQueries({ queryKey: ["customer", id] });
      nav(`/customers/${id}`);
    },
    onError: (e) => toast.error(e.message),
  });

  if (!data) return null;
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit Customer</h1>
      <CustomerForm
        defaultValues={{
          firstName: data.first_name,
          lastName: data.last_name,
          phoneNumber: data.phone_number,
        }}
        submitting={m.isPending}
        onSubmit={(values) => m.mutate(values)}
      />
    </div>
  );
}
