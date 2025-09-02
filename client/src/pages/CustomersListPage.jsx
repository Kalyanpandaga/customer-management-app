import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listCustomers, deleteCustomer } from "../services/customers";
import { Button, Card } from "../components/UI";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function CustomersListPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    city: "",
    state: "",
    pinCode: "",
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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-lg md:text-xl font-semibold">Customers</h1>
        <div className="flex gap-2">
          <Link to="/customers/new" className="w-full">
            <Button className=" text-sm py-2">New Customer</Button>
          </Link>
        </div>
      </div>

      <Card>
        <Filters
          defaults={filters}
          onChange={updateFilters}
          onClear={clearFilters}
        />
      </Card>

      <Card>
        <div className="overflow-x-auto">
          {isFetching ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-gray-500" size={32} />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Phone</th>
                  <th className="hidden md:table-cell text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b last:border-0 cursor-pointer hover:bg-gray-50"
                    onClick={(e) => {
                      navigate(`/customers/${c.id}`);
                    }}
                  >
                    <td className="py-2">{c.first_name}</td>
                    <td>{c.last_name}</td>
                    <td>{c.phone_number}</td>
                    <td className="hidden md:table-cell text-center space-x-3">
                      <Link
                        to={`/customers/${c.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View
                      </Link>
                      <Link
                        to={`/customers/${c.id}/edit`}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(c.id);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!data?.length && (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">
                      No results
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Pagination page={page} onPage={setPage} hasNext={hasNext} />
          <div className="hidden md:block text-xs text-gray-500">
            Sorted by First Name ({filters.sort})
          </div>
        </div>
      </Card>
    </div>
  );
}
