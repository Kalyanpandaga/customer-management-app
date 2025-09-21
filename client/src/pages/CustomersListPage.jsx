import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listCustomers, deleteCustomer } from "../services/customers";
import { Button, Card, Badge, LoadingSpinner } from "../components/UI";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";
import toast from "react-hot-toast";
import {
  Loader2,
  Users,
  MapPin,
  Phone,
  Eye,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";

export default function CustomersListPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    city: "",
    state: "",
    pinCode: "",
    search: "",
    sort: "asc",
  });
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isFetching } = useQuery({
    queryKey: ["customers", { page, limit, ...filters }],
    queryFn: () => listCustomers({ page, limit, ...filters }),
  });

  const hasNext = data && data.length === limit;

  function updateFilters(newFilters) {
    setFilters(newFilters);
    setPage(1);
  }

  function clearFilters() {
    setFilters({
      city: "",
      state: "",
      pinCode: "",
      search: "",
      sort: "asc",
    });
    setPage(1);
  }

  function onDelete(id) {
    toast.promise(
      deleteCustomer(id).then(() => {
        queryClient.invalidateQueries({ queryKey: ["customers"] });
      }),
      {
        loading: "Deleting...",
        success: "Customer deleted!",
        error: "Delete failed",
      }
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
            <Users className="text-blue-600" size={18} />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              Customers
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Manage your customer database
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/customers/new" className="flex-1 sm:flex-none">
            <Button className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5">
              <Plus size={14} />
              <span className="hidden xs:inline">New Customer</span>
              <span className="xs:hidden">New</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Filters
        defaults={filters}
        onChange={updateFilters}
        onClear={clearFilters}
      />

      {/* Customers List */}
      {isFetching ? (
        <Card className="p-8">
          <div className="flex flex-col justify-center items-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-gray-500">Loading customers...</p>
          </div>
        </Card>
      ) : data?.length > 0 ? (
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-gray-200">
                      <th className="pb-3 font-semibold text-gray-900">
                        Customer
                      </th>
                      <th className="pb-3 font-semibold text-gray-900">
                        Phone
                      </th>
                      <th className="pb-3 font-semibold text-gray-900">
                        Addresses
                      </th>
                      <th className="pb-3 font-semibold text-gray-900 text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.map((c) => (
                      <tr
                        key={c.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                              {c.first_name} {c.last_name}
                            </span>
                            <span className="text-xs text-gray-500">
                              ID: {c.id}
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-gray-400" />
                            <span className="font-mono text-sm">
                              {c.phone_number}
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-gray-400" />
                            <Badge
                              variant={
                                c.address_count === 1
                                  ? "info"
                                  : c.address_count > 1
                                  ? "success"
                                  : "default"
                              }
                            >
                              {c.address_count || 0} address
                              {c.address_count !== 1 ? "es" : ""}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/customers/${c.id}`)}
                              className="flex items-center gap-1 text-xs px-2 py-1"
                            >
                              <Eye size={12} />
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigate(`/customers/${c.id}/edit`)
                              }
                              className="flex items-center gap-1 text-xs px-2 py-1"
                            >
                              <Edit size={12} />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(c.id)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs px-2 py-1"
                            >
                              <Trash2 size={12} />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {data.map((c) => (
              <Card
                key={c.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  {/* Customer Info */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {c.first_name} {c.last_name}
                      </h3>
                      <p className="text-sm text-gray-500">ID: {c.id}</p>
                    </div>
                    <Badge
                      variant={
                        c.address_count === 1
                          ? "info"
                          : c.address_count > 1
                          ? "success"
                          : "default"
                      }
                    >
                      {c.address_count || 0} address
                      {c.address_count !== 1 ? "es" : ""}
                    </Badge>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <span className="font-mono text-sm text-gray-900">
                      {c.phone_number}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1.5 pt-2 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/customers/${c.id}`)}
                      className="flex-1 justify-center text-xs py-1.5 px-2"
                    >
                      <Eye size={14} className="mr-1" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/customers/${c.id}/edit`)}
                      className="flex-1 justify-center text-xs py-1.5 px-2"
                    >
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(c.id)}
                      className="flex-1 justify-center text-red-600 hover:text-red-700 hover:bg-red-50 text-xs py-1.5 px-2"
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <Pagination page={page} onPage={setPage} hasNext={hasNext} />
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Sorted by First Name</span>
              <Badge variant="default">
                {filters.sort === "asc" ? "A-Z" : "Z-A"}
              </Badge>
            </div>
          </div>
        </div>
      ) : (
        <Card className="p-8">
          <div className="text-center">
            <Users className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No customers found
            </h3>
            <p className="text-gray-500 mb-4">
              {Object.values(filters).some((f) => f)
                ? "Try adjusting your filters"
                : "Get started by adding your first customer"}
            </p>
            {!Object.values(filters).some((f) => f) && (
              <Link to="/customers/new">
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  Add First Customer
                </Button>
              </Link>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
