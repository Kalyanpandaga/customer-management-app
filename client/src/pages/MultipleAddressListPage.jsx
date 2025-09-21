import { useQuery } from "@tanstack/react-query";
import { listMultipleAddressCustomers } from "../services/customers";
import { Card, Button } from "../components/UI";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, MapPin } from "lucide-react";

export default function MultipleAddressListPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["report-multi"],
    queryFn: listMultipleAddressCustomers,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
          <MapPin className="text-green-600" size={18} />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            Multiple Address Customers
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Customers with multiple addresses
          </p>
        </div>
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : data?.length > 0 ? (
          data.map((c) => (
            <Card key={c.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Users size={16} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {c.first_name} {c.last_name}
                      </h3>
                      <p className="text-xs text-gray-500">ID: {c.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin size={14} />
                    <span>{c.address_count} addresses</span>
                  </div>
                </div>
                <Link
                  to={`/customers/${c.id}`}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  View
                </Link>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Users className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No customers found
            </h3>
            <p className="text-gray-500">
              No customers with multiple addresses found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
