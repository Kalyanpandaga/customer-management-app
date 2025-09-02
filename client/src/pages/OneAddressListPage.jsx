import { useQuery } from "@tanstack/react-query";
import { listOneAddressCustomers } from "../services/customers";
import { Card } from "../components/UI";
import { Link } from "react-router-dom";

export default function OneAddressListPage() {
  const { data } = useQuery({
    queryKey: ["report-one"],
    queryFn: listOneAddressCustomers,
  });
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Only One Address</h1>
      <Card>
        <ul className="divide-y">
          {data?.map((c) => (
            <li key={c.id} className="py-2 flex items-center justify-between">
              <div className="text-sm">
                #{c.id} – {c.first_name} {c.last_name}
              </div>
              <Link
                to={`/customers/${c.id}`}
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded"
              >
                Open
              </Link>
            </li>
          ))}
          {!data?.length && (
            <li className="py-6 text-center text-sm text-gray-500">No data</li>
          )}
        </ul>
      </Card>
    </div>
  );
}
