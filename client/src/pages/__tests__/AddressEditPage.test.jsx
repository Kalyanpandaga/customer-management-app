import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AddressEditPage from "../AddressEditPage";

const queryClient = new QueryClient();

describe("AddressEditPage", () => {
  it("renders edit address form", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/customers/5/addresses/8/edit"]}>
          <Routes>
            <Route
              path="/customers/:customerId/addresses/:addressId/edit"
              element={<AddressEditPage />}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
    // Use the actual heading text your component renders, e.g. "Edit Address" or just "Edit"
    expect(await screen.findByText(/Edit Address/i)).toBeInTheDocument();
  });
});
