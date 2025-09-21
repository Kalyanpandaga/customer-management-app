import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CustomerCreatePage from "../CustomerCreatePage";

const queryClient = new QueryClient();

describe("CustomerCreatePage", () => {
  it("renders new customer form", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CustomerCreatePage />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(screen.getByText(/New Customer/i)).toBeInTheDocument();
  });
});
