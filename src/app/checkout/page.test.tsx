import { screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderCheckoutPage } from "../test-utils";

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
  describe("Empty cart", () => {
    it("displays empty cart message when no cart data", async () => {
      await renderCheckoutPage(false);

      expect(screen.getByText("Your basket is empty")).toBeInTheDocument();
      expect(
        screen.getByText("Add some items to your basket before checking out.")
      ).toBeInTheDocument();
      expect(screen.getByText("Continue Shopping")).toBeInTheDocument();
    });

    it("displays empty cart message when cart data is empty array", async () => {
      await renderCheckoutPage(false);

      expect(screen.getByText("Your basket is empty")).toBeInTheDocument();
    });
  });

  describe("Cart with items", () => {
    it("displays checkout header and navigation", async () => {
      await renderCheckoutPage(true); // Pass true to get cart with items

      expect(screen.getByText("Checkout")).toBeInTheDocument();
      expect(screen.getByText("← Back to Store")).toBeInTheDocument();
    });

    it("displays order summary with correct totals", async () => {
      await renderCheckoutPage(true); // Pass true to get cart with items

      expect(screen.getByText("Order Summary")).toBeInTheDocument();
      expect(screen.getByText("Total Items:")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument(); // 2 + 1 = 3 items
      expect(screen.getByText("Total Price:")).toBeInTheDocument();
      expect(screen.getByText("£28.00")).toBeInTheDocument(); // (8*2) + (12*1) = 28
    });

    it("displays cart items with correct details", async () => {
      await renderCheckoutPage(true); // Pass true to get cart with items

      expect(screen.getByText("Items in your basket:")).toBeInTheDocument();
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 3")).toBeInTheDocument();
    });

    it("displays correct quantities for each item", async () => {
      await renderCheckoutPage(true); // Pass true to get cart with items

      const quantityElements = screen.getAllByText(/Quantity:/);
      expect(quantityElements).toHaveLength(2);

      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
    });
  });

  describe("Invalid cart data", () => {
    it("handles malformed JSON gracefully", async () => {
      await renderCheckoutPage(false); // This will use our helper to clear cart data

      expect(screen.getByText("Your basket is empty")).toBeInTheDocument();
    });
  });

  describe("Product details lookup", () => {
    it("displays correct product information for items in cart", async () => {
      await renderCheckoutPage(true); // Pass true to get cart with items

      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("£8.00 - 50 in stock")).toBeInTheDocument();

      expect(screen.getByText("Item 3")).toBeInTheDocument();
      expect(screen.getByText("£12.00 - 25 in stock")).toBeInTheDocument();
    });
  });
});
