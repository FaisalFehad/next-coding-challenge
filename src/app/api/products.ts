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

export function getProductData(product: Product) {
  return {
    id: product.id.toString(),
    name: product.name.uk,
    description: `£${product.price.gbp} - ${product.stock} in stock`,
    price: product.price.gbp,
    stock: product.stock,
  };
}
