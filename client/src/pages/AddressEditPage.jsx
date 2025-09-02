import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAddress, updateAddress } from "../services/addresses";
import AddressForm from "../components/AddressForm";
import toast from "react-hot-toast";

export default function AddressEditPage() {
  const { addressId } = useParams();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["address", addressId],
    queryFn: () => getAddress(addressId),
  });
  const m = useMutation({
    mutationFn: (vals) => updateAddress(addressId, vals),
    onSuccess: () => {
      toast.success("Address updated");
      qc.invalidateQueries({ queryKey: ["address", addressId] });
      nav(-1);
    },
    onError: (e) => toast.error(e.message),
  });

  if (!data) return null;
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Edit Address</h1>
      <AddressForm
        defaultValues={{
          addressDetails: data.address_details,
          city: data.city,
          state: data.state,
          pinCode: data.pin_code,
        }}
        submitting={m.isPending}
        onSubmit={(values) => m.mutate(values)}
      />
    </div>
  );
}
