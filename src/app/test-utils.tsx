import { render } from "@testing-library/react";
import { ReactElement } from "react";

jest.mock("./api/products", () => ({
  getProductData: (data: any) => data,
  fetchMoreProductsClient: jest.fn(() => Promise.resolve([])),
}));

const mockCookieData: { [key: string]: string | undefined } = {};

jest.mock("js-cookie", () => ({
  get: jest.fn((key: string) => {
    return mockCookieData[key];
  }),
  set: jest.fn((key: string, value: string) => {
    mockCookieData[key] = value;
  }),
  remove: jest.fn((key: string) => {
    delete mockCookieData[key];
  }),
}));

export function setMockCartData(cartItems: any[]) {
  const cartData = JSON.stringify(cartItems);
  mockCookieData["cart"] = cartData;
  mockCookieData["shopping-cart"] = cartData;
}

export function clearMockCartData() {
  delete mockCookieData["cart"];
  delete mockCookieData["shopping-cart"];
}

export async function renderAsync(component: Promise<ReactElement>) {
  const resolvedComponent = await component;
  return render(resolvedComponent);
}

export async function renderHome(withCartData = false) {
  if (!withCartData) {
    clearMockCartData();
  }

  const mockProducts = [
    {
      id: "1",
      name: "Item 1",
      description: "£8.00 - 50 in stock",
      price: 8.0,
      stock: 50,
    },
    {
      id: "2",
      name: "Item 2",
      description: "£16.00 - 30 in stock",
      price: 16.0,
      stock: 30,
    },
    {
      id: "3",
      name: "Item 3",
      description: "£12.00 - 25 in stock",
      price: 12.0,
      stock: 25,
    },
  ];

  const ClientCart = (await import("./components/ClientCart")).default;
  return render(<ClientCart products={mockProducts} locale="uk" />);
}

export async function renderCheckoutPage(withCartData = true) {
  if (withCartData) {
    setMockCartData([
      { id: "1", name: "Item 1", price: 8.0, quantity: 2 },
      { id: "3", name: "Item 3", price: 12.0, quantity: 1 },
    ]);
  } else {
    clearMockCartData();
  }

  const mockProducts = [
    {
      id: "1",
      name: "Item 1",
      description: "£8.00 - 50 in stock",
      price: 8.0,
      stock: 50,
    },
    {
      id: "2",
      name: "Item 2",
      description: "£16.00 - 30 in stock",
      price: 16.0,
      stock: 30,
    },
    {
      id: "3",
      name: "Item 3",
      description: "£12.00 - 25 in stock",
      price: 12.0,
      stock: 25,
    },
  ];

  const ClientCheckout = (await import("./components/ClientCheckout")).default;
  return render(<ClientCheckout products={mockProducts} locale="uk" />);
}
