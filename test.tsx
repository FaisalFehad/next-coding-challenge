import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/app/page";

describe("Home", () => {
  it("renders an empty basket", () => {
    render(<Home />);

    const basketButton = screen.getByRole("button", {
      name: /Basket:/i,
    });

    expect(basketButton).toHaveTextContent("Basket: 0 items");
  });

  it("renders a basket with 1 item", async () => {
    render(<Home />);

    const buttons = screen.getAllByRole("button", {
      name: /Add to basket/i,
    });

    await act(async () => {
      fireEvent.click(buttons[0]);
    });

    const basketButton = screen.getByRole("button", {
      name: /Basket:/i,
    });

    expect(basketButton).toHaveTextContent("Basket: 1 items");
  });

  it("renders a basket with 3 items total (1 of item 1 and 2 of item 2)", async () => {
    render(<Home />);

    const buttons = screen.getAllByRole("button", {
      name: /Add to basket/i,
    });

    await act(async () => {
      fireEvent.click(buttons[0]);
    });

    await act(async () => {
      fireEvent.click(buttons[1]);
    });

    await act(async () => {
      fireEvent.click(buttons[1]);
    });

    const basketButton = screen.getByRole("button", {
      name: /Basket:/i,
    });

    expect(basketButton).toHaveTextContent(/Basket:.*3.*items/);
  });
});
