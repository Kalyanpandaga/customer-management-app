import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CustomerEditPage from "../CustomerEditPage";

describe("CustomerEditPage", () => {
  it("renders form for editing customer", () => {
    render(
      <MemoryRouter>
        <CustomerEditPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Edit Customer/i)).toBeInTheDocument();
  });
});
