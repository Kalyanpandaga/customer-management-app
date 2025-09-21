import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AddressCreatePage from "../AddressCreatePage";

const queryClient = new QueryClient();

describe("AddressCreatePage", () => {
  it("renders add address form", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <AddressCreatePage />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(screen.getByText(/Add Address/i)).toBeInTheDocument();
  });
});
