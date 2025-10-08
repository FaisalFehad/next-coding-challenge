import { screen, fireEvent, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderHome, clearMockCartData } from "./test-utils";

describe("Home Page Tests", () => {
  beforeEach(() => {
    clearMockCartData();
  });

  describe("Initial rendering", () => {
    it("renders the store title", async () => {
      await renderHome();
      expect(
        screen.getByText("Michael's Amazing Web Store")
      ).toBeInTheDocument();
    });

    it("renders the basket with 0 items initially", async () => {
      await renderHome();
      const basketLink = screen.getByRole("link");
      expect(basketLink.textContent).toContain("Basket:");
      expect(basketLink.textContent).toContain("0");
      expect(basketLink.textContent).toContain("items");
    });

    it("renders all products from the items list", async () => {
      await renderHome();
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("£8.00 - 50 in stock")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByText("£16.00 - 30 in stock")).toBeInTheDocument();
      expect(screen.getByText("Item 3")).toBeInTheDocument();
      expect(screen.getByText("£12.00 - 25 in stock")).toBeInTheDocument();
    });

    it("renders product buttons with correct aria-label", async () => {
      await renderHome();
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(3);
      expect(buttons[0]).toHaveAttribute("aria-label", "Add Item 1 to basket");
      expect(buttons[1]).toHaveAttribute("aria-label", "Add Item 2 to basket");
      expect(buttons[2]).toHaveAttribute("aria-label", "Add Item 3 to basket");
    });
  });

  describe("Adding items to cart", () => {
    it("adds a single item to cart and updates basket count", async () => {
      await renderHome();
      const button = screen.getByLabelText("Add Item 1 to basket");

      await act(async () => {
        fireEvent.click(button);
      });

      await waitFor(() => {
        const basketLink = screen.getByRole("link");
        expect(basketLink.textContent).toContain("1");
        expect(basketLink.textContent).toContain("items");
      });
    });

    it("shows item count when items are added", async () => {
      await renderHome();

      const addButton = screen.getByLabelText("Add Item 1 to basket");
      act(() => {
        fireEvent.click(addButton);
      });

      await waitFor(() => {
        expect(screen.getByText(/Item 1 count: 1/)).toBeInTheDocument();
      });
    });

    it("basket link works correctly", async () => {
      await renderHome();
      const basketLink = screen.getByRole("link");
      expect(basketLink).toHaveAttribute("href", "/checkout");
    });
  });

  describe("Accessibility features", () => {
    it("has accessible button labels for adding items to cart", async () => {
      await renderHome();
      expect(screen.getByLabelText("Add Item 1 to basket")).toBeInTheDocument();
      expect(screen.getByLabelText("Add Item 2 to basket")).toBeInTheDocument();
      expect(screen.getByLabelText("Add Item 3 to basket")).toBeInTheDocument();
    });

    it("basket link is properly labeled", async () => {
      await renderHome();
      const basketLink = screen.getByRole("link");
      expect(basketLink).toBeInTheDocument();
      expect(basketLink).toHaveAttribute("href", "/checkout");
    });
  });
});
