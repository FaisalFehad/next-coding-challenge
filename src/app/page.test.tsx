import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "./page";

jest.mock("./items", () => ({
  products: [
    { id: "Item 1", name: "Item name 1", description: "Test description 1" },
    { id: "Item 2", name: "Item name 2", description: "Test description 2" },
    { id: "Item 3", name: "Item name 3", description: "Test description 3" },
  ],
}));

const mockProducts = [
  { id: "Item 1", name: "Item name 1", description: "Test description 1" },
  { id: "Item 2", name: "Item name 2", description: "Test description 2" },
  { id: "Item 3", name: "Item name 3", description: "Test description 3" },
];

describe("Home Page Tests", () => {
  describe("Initial rendering", () => {
    beforeEach(() => {
      render(<Home />);
    });

    it("renders the store title", () => {
      expect(
        screen.getByText("Michael's Amazing Web Store")
      ).toBeInTheDocument();
    });

    it("renders the basket with 0 items initially", () => {
      expect(screen.getByText(/Basket:.*0.*items/)).toBeInTheDocument();
    });

    it("renders all products from the items list", () => {
      mockProducts.forEach((product) => {
        expect(screen.getByText(product.id)).toBeInTheDocument();
        expect(screen.getByText(product.description)).toBeInTheDocument();
      });
    });

    it("renders product buttons with correct aria-label", () => {
      const productButtons = screen.getAllByLabelText("Add to basket");
      expect(productButtons).toHaveLength(3);
    });
  });

  describe("Adding items to cart", () => {
    it("adds a single item to cart and updates basket count", async () => {
      render(<Home />);
      const item1Button = screen.getByText("Item 1").closest("button");

      await act(async () => {
        fireEvent.click(item1Button!);
      });

      expect(screen.getByText(/Basket:.*1.*items/)).toBeInTheDocument();
      expect(screen.getByText(/Item 1.*count:.*1/)).toBeInTheDocument();
    });

    it("adds multiple different items to cart", async () => {
      render(<Home />);
      const item1Button = screen.getByText("Item 1").closest("button");
      const item2Button = screen.getByText("Item 2").closest("button");

      await act(async () => {
        fireEvent.click(item1Button!);
      });

      await act(async () => {
        fireEvent.click(item2Button!);
      });

      expect(screen.getByText(/Basket:.*2.*items/)).toBeInTheDocument();
      expect(screen.getByText(/Item 1.*count:.*1/)).toBeInTheDocument();
      expect(screen.getByText(/Item 2.*count:.*1/)).toBeInTheDocument();
    });

    it("increments quantity when adding the same item multiple times", async () => {
      render(<Home />);
      const item1Button = screen.getByText("Item 1").closest("button");

      await act(async () => {
        fireEvent.click(item1Button!);
      });

      await act(async () => {
        fireEvent.click(item1Button!);
      });

      await act(async () => {
        fireEvent.click(item1Button!);
      });

      expect(screen.getByText(/Basket:.*3.*items/)).toBeInTheDocument();
      expect(screen.getByText(/Item 1.*count:.*3/)).toBeInTheDocument();
    });

    it("correctly calculates total items when adding mixed items", async () => {
      render(<Home />);
      const item1Button = screen.getByText("Item 1").closest("button");
      const item2Button = screen.getByText("Item 2").closest("button");
      const item3Button = screen.getByText("Item 3").closest("button");

      await act(async () => {
        fireEvent.click(item1Button!);
      });

      await act(async () => {
        fireEvent.click(item1Button!);
      });

      await act(async () => {
        fireEvent.click(item2Button!);
      });

      await act(async () => {
        fireEvent.click(item3Button!);
      });

      await act(async () => {
        fireEvent.click(item3Button!);
      });

      await act(async () => {
        fireEvent.click(item3Button!);
      });

      expect(screen.getByText(/Basket:.*6.*items/)).toBeInTheDocument();
      expect(screen.getByText(/Item 1.*count:.*2/)).toBeInTheDocument();
      expect(screen.getByText(/Item 2.*count:.*1/)).toBeInTheDocument();
      expect(screen.getByText(/Item 3.*count:.*3/)).toBeInTheDocument();
    });
  });

  describe("Cart display functionality", () => {
    it("shows cart items when items are added", async () => {
      render(<Home />);
      const item1Button = screen.getByText("Item 1").closest("button");
      const item2Button = screen.getByText("Item 2").closest("button");

      await act(async () => {
        fireEvent.click(item1Button!);
      });

      await act(async () => {
        fireEvent.click(item2Button!);
      });

      const cartItems = screen.getAllByText(/count:/);
      expect(cartItems).toHaveLength(2);
      expect(cartItems[0]).toHaveTextContent(/Item 1.*count:/);
      expect(cartItems[1]).toHaveTextContent(/Item 2.*count:/);
    });

    it("does not show cart items when cart is empty", () => {
      render(<Home />);
      expect(screen.queryByText(/count:/)).not.toBeInTheDocument();
    });
  });

  describe("Product grid layout", () => {
    it("renders products in a grid layout with correct content", () => {
      render(<Home />);
      const productButtons = screen.getAllByLabelText("Add to basket");
      expect(productButtons).toHaveLength(3);

      productButtons.forEach((button, index) => {
        const expectedProduct = mockProducts[index];

        expect(button).toHaveTextContent(expectedProduct.id);
        expect(button).toHaveTextContent(expectedProduct.description);
        expect(button).toHaveTextContent("->");
      });
    });
  });

  describe("ItemCount component functionality", () => {
    it("displays item name and count correctly", async () => {
      render(<Home />);
      const item1Button = screen.getByText("Item 1").closest("button");

      await act(async () => {
        fireEvent.click(item1Button!);
      });

      await act(async () => {
        fireEvent.click(item1Button!);
      });

      expect(screen.getByText(/Item 1.*count:.*2/)).toBeInTheDocument();
    });
  });

  describe("Accessibility features", () => {
    it("has accessible button labels for adding items to cart", () => {
      render(<Home />);
      const productButtons = screen.getAllByLabelText("Add to basket");
      productButtons.forEach((button) => {
        expect(button).toBeInstanceOf(HTMLButtonElement);
        expect(button).toHaveAttribute("aria-label", "Add to basket");
      });
    });

    it("basket button is properly labeled", () => {
      render(<Home />);
      const basketButton = screen.getByText(/Basket:.*0.*items/);
      expect(basketButton).toBeInstanceOf(HTMLButtonElement);
    });
  });
});
