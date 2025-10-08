import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderCheckoutPage } from "../__tests__/test-utils";

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

describe("Checkout Page", () => {
  beforeEach(() => {
    if ((global as any).mockCookies) {
      Object.keys((global as any).mockCookies).forEach(
        (key) => delete (global as any).mockCookies[key]
      );
    }
  });

  describe("Empty cart", () => {
    it("displays empty cart message when no cart data", async () => {
      await renderCheckoutPage();

      expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
      expect(
        screen.getByText("Add some items to your cart before checking out.")
      ).toBeInTheDocument();
      expect(screen.getByText("Continue Shopping")).toBeInTheDocument();
    });

    it("displays empty cart message when cart data is empty array", async () => {
      (global as any).mockCookies = { cart: JSON.stringify([]) };

      await renderCheckoutPage();

      expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    });
  });

  describe("Cart with items", () => {
    beforeEach(() => {
      const cartData = [
        { id: "1", name: "Item 1", quantity: 2 },
        { id: "3", name: "Item 3", quantity: 1 },
      ];
      (global as any).mockCookies = { cart: JSON.stringify(cartData) };
    });

    it("displays checkout header and navigation", async () => {
      await renderCheckoutPage();

      expect(screen.getByText("Checkout")).toBeInTheDocument();
      expect(screen.getByText("← Back to Store")).toBeInTheDocument();
    });

    it("displays order summary with correct total items", async () => {
      await renderCheckoutPage();

      expect(screen.getByText("Order Summary")).toBeInTheDocument();
      expect(screen.getByText("Total Items:")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("displays all cart items with correct details", async () => {
      await renderCheckoutPage();

      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 3")).toBeInTheDocument();
      expect(screen.getByText("Product ID: 1")).toBeInTheDocument();
      expect(screen.getByText("Product ID: 3")).toBeInTheDocument();
    });

    it("displays correct quantities for each item", async () => {
      await renderCheckoutPage();

      const quantityElements = screen.getAllByText(/Quantity:/);
      expect(quantityElements).toHaveLength(2);

      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });

  describe("Invalid cart data", () => {
    it("handles malformed JSON gracefully", async () => {
      (global as any).mockCookies = { cart: "invalid json" };

      await renderCheckoutPage();

      expect(screen.getByText("Your cart is empty")).toBeInTheDocument();
    });
  });

  describe("Product details lookup", () => {
    it("displays correct product information for items in cart", async () => {
      const cartData = [
        { id: "1", name: "Item 1", quantity: 1 },
        { id: "2", name: "Item 2", quantity: 2 },
      ];
      (global as any).mockCookies = { cart: JSON.stringify(cartData) };

      await renderCheckoutPage();

      expect(screen.getByText("£8.00 - 50 in stock")).toBeInTheDocument();
      expect(screen.getByText("£16.00 - 30 in stock")).toBeInTheDocument();
    });
  });
});
