import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import OneAddressListPage from "../OneAddressListPage";

describe("OneAddressListPage", () => {
  it("renders list of customers with one address", () => {
    render(
      <MemoryRouter>
        <OneAddressListPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Only One Address/i)).toBeInTheDocument();
  });
});
