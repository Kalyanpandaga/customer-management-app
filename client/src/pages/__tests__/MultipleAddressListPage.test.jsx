import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MultipleAddressListPage from "../MultipleAddressListPage";

describe("MultipleAddressListPage", () => {
  it("renders list of customers with multiple addresses", () => {
    render(
      <MemoryRouter>
        <MultipleAddressListPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Multiple Addresses/i)).toBeInTheDocument();
  });
});
