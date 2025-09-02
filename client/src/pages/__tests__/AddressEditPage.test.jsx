import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddressEditPage from "../AddressEditPage";

describe("AddressEditPage", () => {
  it("renders edit address form", () => {
    render(
      <MemoryRouter>
        <AddressEditPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Edit Address/i)).toBeInTheDocument();
  });
});
