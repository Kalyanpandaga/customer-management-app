import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAddress } from "../services/addresses";
import AddressForm from "../components/AddressForm";
import toast from "react-hot-toast";

export default function AddressCreatePage() {
  const { id } = useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const m = useMutation({
    mutationFn: (vals) => createAddress(id, vals),
    onSuccess: () => {
      toast.success("Address added");
      qc.invalidateQueries({ queryKey: ["addresses", id] });
      nav(`/customers/${id}`);
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Add Address</h1>
      <AddressForm
        defaultValues={{ addressDetails: "", city: "", state: "", pinCode: "" }}
        submitting={m.isPending}
        onSubmit={(values) => m.mutate(values)}
      />
    </div>
  );
}
