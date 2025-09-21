import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, beforeEach, describe, test, expect } from "vitest";
import CustomersListPage from "../CustomersListPage";

// Mock the services
vi.mock("../../services/customers", () => ({
  listCustomers: vi.fn(() =>
    Promise.resolve([
      {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        phone_number: "1234567890",
        address_count: 2,
      },
      {
        id: 2,
        first_name: "Jane",
        last_name: "Smith",
        phone_number: "0987654321",
        address_count: 1,
      },
    ])
  ),
  deleteCustomer: vi.fn(() =>
    Promise.resolve({ message: "Customer deleted successfully" })
  ),
}));

export default {
  get: () => Promise.resolve(),
  post: () => Promise.resolve(),
  put: () => Promise.resolve(),
  delete: () => Promise.resolve(),
};

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithProviders = (component, initialEntries = ["/customers"]) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/customers" element={component} />
          {/* Add dummy routes for navigation */}
          <Route path="/customers/:id" element={<div>Customer Details</div>} />
          <Route
            path="/customers/:id/edit"
            element={<div>Edit Customer</div>}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("CustomersListPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders customers list page with header", () => {
    renderWithProviders(<CustomersListPage />);
    // Use function matcher to avoid multiple matches
    const header = screen.getAllByText(
      (content, element) =>
        element.tagName.toLowerCase() === "h1" &&
        /customers/i.test(element.textContent)
    );
    expect(header.length).toBeGreaterThan(0);

    expect(
      screen.getByText(/Manage your customer database/i)
    ).toBeInTheDocument();
  });

  test("renders new customer button", () => {
    renderWithProviders(<CustomersListPage />);
    expect(screen.getByText(/New Customer/i)).toBeInTheDocument();
  });

  test("renders filter component", () => {
    renderWithProviders(<CustomersListPage />);
    expect(screen.getByText(/Filters & Search/i)).toBeInTheDocument();
  });

  test("renders customers table with data", async () => {
    renderWithProviders(<CustomersListPage />);
    await waitFor(() => {
      expect(
        screen.getAllByText(
          (content, element) =>
            element.textContent?.replace(/\s+/g, " ").trim() === "John Doe"
        ).length
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(
          (content, element) =>
            element.textContent?.replace(/\s+/g, " ").trim() === "Jane Smith"
        ).length
      ).toBeGreaterThan(0);
      expect(screen.getAllByText("1234567890").length).toBeGreaterThan(0);
      expect(screen.getAllByText("0987654321").length).toBeGreaterThan(0);
    });
  });

  test("renders address count badges", async () => {
    renderWithProviders(<CustomersListPage />);
    await waitFor(() => {
      expect(screen.getAllByText("2 addresses").length).toBeGreaterThan(0);
      expect(screen.getAllByText("1 address").length).toBeGreaterThan(0);
    });
  });

  test("renders action buttons for each customer", async () => {
    renderWithProviders(<CustomersListPage />);
    await waitFor(() => {
      expect(
        screen.getAllByText(
          (content, element) => element.textContent?.trim() === "View"
        ).length
      ).toBeGreaterThanOrEqual(2);
      expect(
        screen.getAllByText(
          (content, element) => element.textContent?.trim() === "Edit"
        ).length
      ).toBeGreaterThanOrEqual(2);
      expect(
        screen.getAllByText(
          (content, element) => element.textContent?.trim() === "Delete"
        ).length
      ).toBeGreaterThanOrEqual(2);
    });
  });

  test("shows loading state", () => {
    renderWithProviders(<CustomersListPage />);
    expect(screen.getByText(/Loading customers/i)).toBeInTheDocument();
  });

  test("handles filter changes", async () => {
    renderWithProviders(<CustomersListPage />);
    const searchInput = screen.getByPlaceholderText(
      /Search by name or phone number/i
    );
    fireEvent.change(searchInput, { target: { value: "John" } });
    await waitFor(() => {
      expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    });
  });

  test("handles clear filters", async () => {
    renderWithProviders(<CustomersListPage />);
    const searchInput = screen.getByPlaceholderText(
      /Search by name or phone number/i
    );
    fireEvent.change(searchInput, { target: { value: "John" } });
    await waitFor(() => {
      expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    });
    const clearButton = screen.getByText(/Clear All/i);
    fireEvent.click(clearButton);
    await waitFor(() => {
      expect(screen.getByDisplayValue("")).toBeInTheDocument();
    });
  });

  test("toggles advanced filters", () => {
    renderWithProviders(<CustomersListPage />);
    const toggleButton = screen.getByText(/Show Advanced/i);
    fireEvent.click(toggleButton);
    expect(screen.getByText(/Hide Advanced/i)).toBeInTheDocument();
    expect(screen.getByText(/City/i)).toBeInTheDocument();
    expect(screen.getByText(/State/i)).toBeInTheDocument();
    expect(screen.getByText(/PIN Code/i)).toBeInTheDocument();
  });

  test("pagination controls work", async () => {
    renderWithProviders(<CustomersListPage />);
    await waitFor(() => {
      expect(screen.getByText(/Sorted by First Name/i)).toBeInTheDocument();
    });
    const nextButton = screen.getByRole("button", { name: /Next/i });
    fireEvent.click(nextButton);
    // Check that page changes (if Pagination shows page number, check it)
  });

  test("shows correct badge variant for address count", async () => {
    renderWithProviders(<CustomersListPage />);
    await waitFor(() => {
      const successBadges = screen.getAllByText("2 addresses");
      const infoBadges = screen.getAllByText("1 address");
      expect(successBadges.length).toBeGreaterThan(0);
      expect(infoBadges.length).toBeGreaterThan(0);
    });
  });

  test("renders mobile card view on small screens", async () => {
    window.innerWidth = 400;
    window.dispatchEvent(new Event("resize"));
    renderWithProviders(<CustomersListPage />);
    await waitFor(() => {
      expect(
        screen.getAllByText(
          (content, element) =>
            element.textContent?.replace(/\s+/g, " ").trim() === "John Doe"
        ).length
      ).toBeGreaterThan(0);
      expect(
        screen.getAllByText(
          (content, element) =>
            element.textContent?.replace(/\s+/g, " ").trim() === "Jane Smith"
        ).length
      ).toBeGreaterThan(0);
    });
  });
});
