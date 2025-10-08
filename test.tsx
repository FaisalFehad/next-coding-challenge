import { screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { renderHome } from "@/app/__tests__/test-utils";

describe("Home", () => {
  beforeEach(() => {
    if ((global as any).mockCookies) {
      Object.keys((global as any).mockCookies).forEach(
        (key) => delete (global as any).mockCookies[key]
      );
    }
  });

  it("renders an empty basket", async () => {
    await renderHome();

    const basketLink = screen.getByRole("link");
    expect(basketLink.textContent).toContain("Basket:");
    expect(basketLink.textContent).toContain("0");
    expect(basketLink.textContent).toContain("items");
  });

  it("renders a basket with 1 item", async () => {
    await renderHome();

    const button = screen.getByLabelText("Add Item 1 to basket");

    await act(async () => {
      fireEvent.click(button);
    });

    const basketLink = screen.getByRole("link");
    expect(basketLink.textContent).toContain("Basket:");
    expect(basketLink.textContent).toContain("1");
    expect(basketLink.textContent).toContain("items");
  });

  it("adds multiple items to basket", async () => {
    await renderHome();

    const button1 = screen.getByLabelText("Add Item 1 to basket");
    const button2 = screen.getByLabelText("Add Item 2 to basket");

    await act(async () => {
      fireEvent.click(button1);
    });

    await act(async () => {
      fireEvent.click(button2);
    });

    const basketLink = screen.getByRole("link");
    expect(basketLink.textContent).toContain("Basket:");
    expect(basketLink.textContent).toContain("2");
    expect(basketLink.textContent).toContain("items");
  });
});
