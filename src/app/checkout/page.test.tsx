import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import CheckoutPage from "./page";

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

jest.mock("../items", () => ({
  products: [
    { id: "Item 1", name: "Item name 1", description: "Test description 1" },
    { id: "Item 2", name: "Item name 2", description: "Test description 2" },
    { id: "Item 3", name: "Item name 3", description: "Test description 3" },
  ],
}));

describe("Checkout Page", () => {
  const Cookies = require("js-cookie");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Empty cart", () => {
    it("displays empty cart message when no cart data", () => {
      Cookies.get.mockReturnValue(null);

      render(<CheckoutPage />);

      expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
      expect(
        screen.getByText("Add some items to your cart before checking out.")
      ).toBeInTheDocument();
      expect(screen.getByText("Continue Shopping")).toBeInTheDocument();
    });

    it("displays empty cart message when cart data is empty array", () => {
      Cookies.get.mockReturnValue(JSON.stringify([]));

      render(<CheckoutPage />);

      expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    });
  });

  describe("Cart with items", () => {
    const cartItems = [
      { id: "Item 1", name: "Item 1", quantity: 2 },
      { id: "Item 2", name: "Item 2", quantity: 1 },
      { id: "Item 3", name: "Item 3", quantity: 3 },
    ];

    beforeEach(() => {
      Cookies.get.mockReturnValue(JSON.stringify(cartItems));
    });

    it("displays checkout header and navigation", () => {
      render(<CheckoutPage />);

      expect(screen.getByText("Checkout")).toBeInTheDocument();
      expect(screen.getByText("← Back to Store")).toBeInTheDocument();
    });

    it("displays order summary with correct total items", () => {
      render(<CheckoutPage />);

      expect(screen.getByText("Order Summary")).toBeInTheDocument();
      expect(screen.getByText("Total Items:")).toBeInTheDocument();
      expect(screen.getByText("6")).toBeInTheDocument(); // 2 + 1 + 3 = 6
    });

    it("displays all cart items with correct details", () => {
      render(<CheckoutPage />);

      expect(screen.getByText("Items in your cart:")).toBeInTheDocument();

      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Test description 1")).toBeInTheDocument();
      expect(screen.getByText("Product ID: Item 1")).toBeInTheDocument();

      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("Test description 2")).toBeInTheDocument();
      expect(screen.getByText("Product ID: Item 2")).toBeInTheDocument();

      expect(screen.getByText("Item 3")).toBeInTheDocument();
      expect(screen.getByText("Test description 3")).toBeInTheDocument();
      expect(screen.getByText("Product ID: Item 3")).toBeInTheDocument();
    });

    it("displays correct quantities for each item", () => {
      render(<CheckoutPage />);

      const quantityElements = screen.getAllByText(/\d+/);
      const quantities = quantityElements.map((el) => el.textContent);

      expect(quantities).toContain("2");
      expect(quantities).toContain("1");
      expect(quantities).toContain("3");
      expect(quantities).toContain("6");
    });
  });

  describe("Invalid cart data", () => {
    it("handles malformed JSON gracefully", () => {
      Cookies.get.mockReturnValue("invalid-json");

      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      render(<CheckoutPage />);

      expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to parse cart data from cookie:",
        expect.any(Error)
      );

      consoleSpy.mockRestore();
    });
  });

  describe("Product details lookup", () => {
    it("displays unknown product message for items not in products list", () => {
      const cartWithUnknownItem = [
        { id: "Unknown Item", name: "Unknown Item", quantity: 1 },
      ];

      Cookies.get.mockReturnValue(JSON.stringify(cartWithUnknownItem));

      render(<CheckoutPage />);

      expect(screen.getByText("Unknown product")).toBeInTheDocument();
    });
  });
});
