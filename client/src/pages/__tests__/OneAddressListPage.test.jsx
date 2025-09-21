import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OneAddressListPage from "../OneAddressListPage";

const queryClient = new QueryClient();

describe("OneAddressListPage", () => {
  it("renders list of customers with one address", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <OneAddressListPage />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(screen.getByText(/Only One Address/i)).toBeInTheDocument();
  });
});
