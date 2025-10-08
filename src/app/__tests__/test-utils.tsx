import { render } from "@testing-library/react";
import { ReactElement } from "react";

export async function renderAsync(component: Promise<ReactElement>) {
  const resolvedComponent = await component;
  return render(resolvedComponent);
}

export async function renderHome() {
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

  const ClientCart = (await import("../components/ClientCart")).default;
  return render(<ClientCart products={mockProducts} />);
}

export async function renderCheckoutPage() {
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

  const ClientCheckout = (await import("../components/ClientCheckout")).default;
  return render(<ClientCheckout products={mockProducts} />);
}
