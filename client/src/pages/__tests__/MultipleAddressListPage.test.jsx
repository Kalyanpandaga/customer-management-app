import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MultipleAddressListPage from "../MultipleAddressListPage";

const queryClient = new QueryClient();

describe("MultipleAddressListPage", () => {
  it("renders list of customers with multiple addresses", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MultipleAddressListPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(screen.getByText(/Multiple Addresses/i)).toBeInTheDocument();
  });
});
