import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import CustomersListPage from "./pages/CustomersListPage";
import CustomerCreatePage from "./pages/CustomerCreatePage";
import CustomerEditPage from "./pages/CustomerEditPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import AddressEditPage from "./pages/AddressEditPage";
import AddressCreatePage from "./pages/AddressCreatePage";
import OneAddressListPage from "./pages/OneAddressListPage";
import MultipleAddressListPage from "./pages/MultipleAddressListPage";

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/customers" replace />} />
          <Route path="/customers" element={<CustomersListPage />} />
          <Route path="/customers/new" element={<CustomerCreatePage />} />
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
          <Route path="/customers/:id/edit" element={<CustomerEditPage />} />

          <Route
            path="/customers/:id/addresses/new"
            element={<AddressCreatePage />}
          />
          <Route
            path="/addresses/:addressId/edit"
            element={<AddressEditPage />}
          />

          <Route path="/reports/one-address" element={<OneAddressListPage />} />
          <Route
            path="/reports/multiple-address"
            element={<MultipleAddressListPage />}
          />
        </Route>
      </Routes>
    </>
  );
}
