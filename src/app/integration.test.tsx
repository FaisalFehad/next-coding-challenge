import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "./page";

jest.mock("js-cookie", () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

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
  const Cookies = require("js-cookie");

  beforeEach(() => {
    jest.clearAllMocks();
    Cookies.get.mockReturnValue(null);
  });

  it("navigates to checkout with correct cart data when basket is clicked", async () => {
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
      fireEvent.click(buttons[0]);
    });

    const basketLink = screen.getByRole("link", {
      name: /Basket:/i,
    });

    expect(basketLink).toHaveTextContent(/Basket:.*3.*items/);

    expect(basketLink).toHaveAttribute("href", "/checkout");

    expect(Cookies.set).toHaveBeenCalledWith(
      "cart",
      expect.stringMatching(/^\[.*\]$/),
      { expires: 7 }
    );

    const lastCall = Cookies.set.mock.calls[Cookies.set.mock.calls.length - 1];
    if (lastCall && lastCall[1]) {
      const cartData = JSON.parse(lastCall[1]);

      expect(cartData).toHaveLength(2);

      const item1 = cartData.find((item: any) => item.id === "Item 1");
      const item2 = cartData.find((item: any) => item.id === "Item 2");

      expect(item1).toBeDefined();
      expect(item1.quantity).toBe(2);
      expect(item1.name).toBe("Item 1");

      expect(item2).toBeDefined();
      expect(item2.quantity).toBe(1);
      expect(item2.name).toBe("Item 2");
    }
  });

  it("shows clickable basket link when cart is empty", () => {
    render(<Home />);

    const basketLink = screen.getByRole("link", {
      name: /Basket:/i,
    });

    expect(basketLink).toHaveTextContent("Basket: 0 items");
    expect(basketLink).toHaveAttribute("href", "/checkout");
  });

  it("shows item counts in the main page cart summary", async () => {
    const { container } = render(<Home />);

    const buttons = screen.getAllByRole("button", {
      name: /Add to basket/i,
    });

    await act(async () => {
      fireEvent.click(buttons[0]);
    });

    await act(async () => {
      fireEvent.click(buttons[0]);
    });

    await act(async () => {
      fireEvent.click(buttons[1]);
    });

    expect(screen.getByText(/Basket:.*3.*items/)).toBeInTheDocument();

    const html = container.innerHTML;
    expect(html).toContain("Item 1");
    expect(html).toContain("Item 2");
    expect(html).toContain("count:");
  });
});
