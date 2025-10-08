import { Locale, formatCurrency } from "../lib/i18n";

export interface Product {
  id: number;
  name: {
    us: string;
    uk: string;
  };
  price: {
    usd: number;
    gbp: number;
  };
  stock: number;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(
      "https://v0-api-endpoint-request.vercel.app/api/products",
      {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data: ProductsResponse = await response.json();

    if (!data.success) {
      throw new Error("API returned unsuccessful response");
    }

    return data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function fetchMoreProducts(): Promise<Product[]> {
  try {
    const response = await fetch(
      "https://v0-api-endpoint-request.vercel.app/api/more-products",
      {
        next: { revalidate: 300 }, // Revalidate every 5 minutes
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch more products: ${response.status}`);
    }

    const data: ProductsResponse = await response.json();

    if (!data.success) {
      throw new Error("API returned unsuccessful response");
    }

    return data.products;
  } catch (error) {
    console.error("Error fetching more products:", error);
    return [];
  }
}

export async function fetchMoreProductsClient(): Promise<Product[]> {
  try {
    const response = await fetch(
      "https://v0-api-endpoint-request.vercel.app/api/more-products"
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch more products: ${response.status}`);
    }

    const data: ProductsResponse = await response.json();

    if (!data.success) {
      throw new Error("API returned unsuccessful response");
    }

    return data.products;
  } catch (error) {
    console.error("Error fetching more products:", error);
    return [];
  }
}

export function getProductData(product: Product, locale: Locale = "uk") {
  const name = getLocalizedProductName(product, locale);
  const price = getLocalizedProductPrice(product, locale);
  const description = `${formatCurrency(price, locale)} - ${
    product.stock
  } in stock`;

  return {
    id: product.id.toString(),
    name,
    description,
    price,
    stock: product.stock,
  };
}

export function getLocalizedProductName(
  product: Product,
  locale: Locale
): string {
  return locale === "us" ? product.name.us : product.name.uk;
}

export function getLocalizedProductPrice(
  product: Product,
  locale: Locale
): number {
  return locale === "us" ? product.price.usd : product.price.gbp;
}
