import {
  fetchProducts,
  fetchMoreProducts,
  getProductData,
  Product,
} from "../api/products";
import { Locale } from "./i18n";
import { Product as TransformedProduct } from "./types";

export async function fetchAllProducts(
  locale: Locale
): Promise<TransformedProduct[]> {
  const [initialProducts, moreProducts] = await Promise.allSettled([
    fetchProducts(),
    fetchMoreProducts(),
  ]);

  let allProducts: Product[] = [];

  if (initialProducts.status === "fulfilled") {
    allProducts = [...allProducts, ...initialProducts.value];
  }

  if (moreProducts.status === "fulfilled") {
    allProducts = [...allProducts, ...moreProducts.value];
  }

  const uniqueProducts = allProducts.filter(
    (product, index, self) =>
      index === self.findIndex((p) => p.id === product.id)
  );

  return uniqueProducts.map((product) => getProductData(product, locale));
}
