import { screen, fireEvent, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderHome, clearMockCartData } from "./test-utils";

jest.mock("next/link", () => {
  const MockLink = ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href: string;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  );
  MockLink.displayName = "MockLink";
  return MockLink;
});

describe("Shopping Cart Integration", () => {
  beforeEach(() => {
    clearMockCartData();
  });

  it("navigates to checkout with correct cart data when basket is clicked", async () => {
    await renderHome();

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);

    await act(async () => {
      fireEvent.click(buttons[0]);
    });

    const basketLink = screen.getByRole("link");
    expect(basketLink).toHaveAttribute("href", "/checkout");
    expect(basketLink.textContent).toContain("1");
    expect(basketLink.textContent).toContain("item");
  });

  it("shows clickable basket link when cart is empty", async () => {
    await renderHome();

    const basketLink = screen.getByRole("link");
    expect(basketLink).toBeInTheDocument();
    expect(basketLink).toHaveAttribute("href", "/checkout");
    expect(basketLink.textContent).toContain("0");
    expect(basketLink.textContent).toContain("items");
  });

  it("shows item counts in the main page cart summary", async () => {
    const component = await renderHome();

    // Find and click the first item button
    const addButton = screen.getByLabelText("Add to Cart Item 1 to basket");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Basket: 1 item")).toBeInTheDocument(); // Use singular for 1 item
    });

    expect(screen.getByText(/Item 1 count: 1/)).toBeInTheDocument();
  });
});
