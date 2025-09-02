import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getCustomer } from "../services/customers";
import { listAddresses, deleteAddress } from "../services/addresses";
import { Button, Card } from "../components/UI";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: customer, isLoading: customerLoading } = useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomer(id),
  });
  const { data: addresses, isLoading: addressesLoading } = useQuery({
    queryKey: ["addresses", id],
    queryFn: () => listAddresses(id),
  });
  const qc = useQueryClient();

  const mDel = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      toast.success("Address deleted");
      qc.invalidateQueries({ queryKey: ["addresses", id] });
    },
    onError: (e) => toast.error(e.message),
  });

  // Show loading state
  if (customerLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-gray-500" size={32} />
      </div>
    );
  }
  if (!customer) {
    return <div className="text-red-600">Customer not found.</div>;
  }

  const count = addresses?.length || 0;
  const badge =
    count === 1
      ? "Only One Address"
      : count > 1
      ? `${count} Addresses`
      : "No Addresses";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Customer #{customer.id}</h1>
        <div className="text-xs px-3 py-1 rounded-full bg-gray-100">
          {badge}
        </div>
      </div>

      <Card>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-500">First Name</div>
            <div className="font-medium">{customer.first_name}</div>
          </div>
          <div>
            <div className="text-gray-500">Last Name</div>
            <div className="font-medium">{customer.last_name}</div>
          </div>
          <div>
            <div className="text-gray-500">Phone</div>
            <div className="font-medium">{customer.phone_number}</div>
          </div>
          <div className="md:text-right space-x-2">
            <Link to={`/customers/${id}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <Link to={`/customers/${id}/addresses/new`}>
              <Button>Add Address</Button>
            </Link>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-3">Addresses</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>PIN</th>
                <th className="hidden md:table-cell text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {addressesLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    Loading addresses...
                  </td>
                </tr>
              ) : (
                addresses?.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b last:border-0 cursor-pointer hover:bg-gray-50"
                    onClick={(e) => {
                      navigate(`/addresses/${a.id}/edit`);
                    }}
                  >
                    <td>{a.address_details}</td>
                    <td>{a.city}</td>
                    <td>{a.state}</td>
                    <td>{a.pin_code}</td>
                    <td className="md:table-cell text-center space-x-2">
                      <Link
                        to={`/addresses/${a.id}/edit`}
                        className="bg-green-500 hover:bg-green-600 text-white md:py-2 md:px-4 py-1 px-1 rounded"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Edit
                      </Link>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white md:py-2 md:px-4 py-1 px-1 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Delete this address?"))
                            mDel.mutate(a.id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {!addressesLoading && !addresses?.length && (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No addresses yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
