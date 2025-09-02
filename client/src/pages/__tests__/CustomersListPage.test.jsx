import { render, screen } from "@testing-library/react";
import CustomersListPage from "../CustomersListPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

test("renders customers list page", () => {
  render(
    <QueryClientProvider client={queryClient}>
      <CustomersListPage />
    </QueryClientProvider>
  );
  expect(screen.getByText(/Customers/i)).toBeInTheDocument();
});
