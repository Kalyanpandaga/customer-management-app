import React from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getCustomer } from "../services/customers";
import { listAddresses, deleteAddress } from "../services/addresses";
import { Button, Card, Badge } from "../components/UI";
import toast from "react-hot-toast";
import {
  Loader2,
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Edit,
  Plus,
  Trash2,
  Building2,
  Navigation,
} from "lucide-react";

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
      toast.success("Address deleted successfully");
      qc.invalidateQueries({ queryKey: ["addresses", id] });
    },
    onError: (e) => toast.error(e.message),
  });

  // Show loading state
  if (customerLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <p className="text-gray-500">Loading customer details...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <User className="mx-auto text-gray-300 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Customer not found
        </h3>
        <p className="text-gray-500 mb-4">
          The customer you're looking for doesn't exist.
        </p>
        <Button onClick={() => navigate("/customers")}>
          Back to Customers
        </Button>
      </div>
    );
  }

  const count = addresses?.length || 0;
  const badgeVariant = count === 1 ? "info" : count > 1 ? "success" : "default";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
          <User className="text-blue-600" size={18} />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            {customer.first_name} {customer.last_name}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Customer ID: {customer.id}
          </p>
        </div>
      </div>

      {/* Customer Info Card */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="text-gray-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">First Name</p>
                  <p className="font-semibold text-gray-900">
                    {customer.first_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <User className="text-gray-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Name</p>
                  <p className="font-semibold text-gray-900">
                    {customer.last_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Phone className="text-gray-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-semibold text-gray-900 font-mono">
                    {customer.phone_number}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <MapPin className="text-gray-600" size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Addresses</p>
                  <Badge variant={badgeVariant}>
                    {count === 0
                      ? "No addresses"
                      : count === 1
                      ? "1 address"
                      : `${count} addresses`}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Link to={`/customers/${id}/edit`} className="flex-1 sm:flex-none">
              <Button
                variant="secondary"
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm py-2 px-3"
              >
                <Edit size={14} />
                <span className="hidden xs:inline">Edit Customer</span>
                <span className="xs:hidden">Edit</span>
              </Button>
            </Link>
            <Link
              to={`/customers/${id}/addresses/new`}
              className="flex-1 sm:flex-none"
            >
              <Button className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm py-2 px-3">
                <Plus size={14} />
                <span className="hidden xs:inline">Add Address</span>
                <span className="xs:hidden">Add</span>
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Addresses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Building2 size={20} />
            Addresses
          </h2>
          {addresses?.length > 0 && (
            <Badge variant="default">
              {addresses.length} address{addresses.length !== 1 ? "es" : ""}
            </Badge>
          )}
        </div>

        {addressesLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="animate-spin text-blue-600" size={24} />
          </div>
        ) : addresses?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addresses.map((address) => (
              <Card
                key={address.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 rounded">
                        <Navigation className="text-blue-600" size={16} />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        Address #{address.id}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <Link
                        to={`/addresses/${address.id}/edit`}
                        className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Edit address"
                      >
                        <Edit size={12} />
                      </Link>
                      <button
                        onClick={() => {
                          if (
                            confirm(
                              "Are you sure you want to delete this address?"
                            )
                          ) {
                            mDel.mutate(address.id);
                          }
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete address"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-sm font-medium text-gray-900">
                        {address.address_details}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">City</p>
                        <p className="text-sm font-medium text-gray-900">
                          {address.city}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">State</p>
                        <p className="text-sm font-medium text-gray-900">
                          {address.state}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">PIN Code</p>
                      <p className="text-sm font-medium text-gray-900 font-mono">
                        {address.pin_code}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <MapPin className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No addresses yet
            </h3>
            <p className="text-gray-500 mb-4">
              This customer doesn't have any addresses yet.
            </p>
            <Link to={`/customers/${id}/addresses/new`}>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Add First Address
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
