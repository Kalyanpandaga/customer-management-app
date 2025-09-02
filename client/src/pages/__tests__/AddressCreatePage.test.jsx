import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddressCreatePage from "../AddressCreatePage";

describe("AddressCreatePage", () => {
  it("renders create address form", () => {
    render(
      <MemoryRouter>
        <AddressCreatePage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Create Address/i)).toBeInTheDocument();
  });
});
