import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CustomerCreatePage from "../CustomerCreatePage";

describe("CustomerCreatePage", () => {
  it("renders create customer form", () => {
    render(
      <MemoryRouter>
        <CustomerCreatePage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Create Customer/i)).toBeInTheDocument();
  });
});
