import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CustomersListPage from "../CustomersListPage";

// Mock the services
jest.mock("../../services/customers", () => ({
  listCustomers: jest.fn(() =>
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
  deleteCustomer: jest.fn(() =>
    Promise.resolve({ message: "Customer deleted successfully" })
  ),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithProviders = (component) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe("CustomersListPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders customers list page with header", () => {
    renderWithProviders(<CustomersListPage />);
    expect(screen.getByText("Customers")).toBeInTheDocument();
    expect(
      screen.getByText("Manage your customer database")
    ).toBeInTheDocument();
  });

  test("renders new customer button", () => {
    renderWithProviders(<CustomersListPage />);
    expect(screen.getByText("New Customer")).toBeInTheDocument();
  });

  test("renders filter component", () => {
    renderWithProviders(<CustomersListPage />);
    expect(screen.getByText("Filters & Search")).toBeInTheDocument();
  });

  test("renders customers table with data", async () => {
    renderWithProviders(<CustomersListPage />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("1234567890")).toBeInTheDocument();
      expect(screen.getByText("0987654321")).toBeInTheDocument();
    });
  });

  test("renders address count badges", async () => {
    renderWithProviders(<CustomersListPage />);

    await waitFor(() => {
      expect(screen.getByText("2 addresses")).toBeInTheDocument();
      expect(screen.getByText("1 address")).toBeInTheDocument();
    });
  });

  test("renders action buttons for each customer", async () => {
    renderWithProviders(<CustomersListPage />);

    await waitFor(() => {
      const viewButtons = screen.getAllByText("View");
      const editButtons = screen.getAllByText("Edit");
      const deleteButtons = screen.getAllByText("Delete");

      expect(viewButtons).toHaveLength(2);
      expect(editButtons).toHaveLength(2);
      expect(deleteButtons).toHaveLength(2);
    });
  });

  test("shows loading state", () => {
    renderWithProviders(<CustomersListPage />);
    expect(screen.getByText("Loading customers...")).toBeInTheDocument();
  });

  test("shows empty state when no customers", async () => {
    const { listCustomers } = require("../../services/customers");
    listCustomers.mockResolvedValueOnce([]);

    renderWithProviders(<CustomersListPage />);

    await waitFor(() => {
      expect(screen.getByText("No customers found")).toBeInTheDocument();
      expect(
        screen.getByText("Get started by adding your first customer")
      ).toBeInTheDocument();
    });
  });

  test("handles filter changes", async () => {
    renderWithProviders(<CustomersListPage />);

    const searchInput = screen.getByPlaceholderText(
      "Search by name or phone number..."
    );
    fireEvent.change(searchInput, { target: { value: "John" } });

    // Wait for debounced search
    await waitFor(
      () => {
        expect(screen.getByDisplayValue("John")).toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });

  test("handles clear filters", async () => {
    renderWithProviders(<CustomersListPage />);

    const searchInput = screen.getByPlaceholderText(
      "Search by name or phone number..."
    );
    fireEvent.change(searchInput, { target: { value: "John" } });

    await waitFor(() => {
      expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    });

    const clearButton = screen.getByText("Clear All");
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.getByDisplayValue("")).toBeInTheDocument();
    });
  });

  test("toggles advanced filters", () => {
    renderWithProviders(<CustomersListPage />);

    const toggleButton = screen.getByText("Show Advanced");
    fireEvent.click(toggleButton);

    expect(screen.getByText("Hide Advanced")).toBeInTheDocument();
    expect(screen.getByText("City")).toBeInTheDocument();
    expect(screen.getByText("State")).toBeInTheDocument();
    expect(screen.getByText("PIN Code")).toBeInTheDocument();
  });
});
