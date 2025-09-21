import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CustomerEditPage from "../CustomerEditPage";

const queryClient = new QueryClient();

describe("CustomerEditPage", () => {
  it("renders edit customer form", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/customers/5/edit"]}>
          <Routes>
            <Route path="/customers/:id/edit" element={<CustomerEditPage />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(await screen.findByText(/Edit Customer/i)).toBeInTheDocument();
  });
});
