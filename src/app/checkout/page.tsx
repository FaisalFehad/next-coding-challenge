import {
  fetchProducts,
  fetchMoreProducts,
  getProductData,
  Product,
} from "../api/products";
import ClientCheckout from "../components/ClientCheckout";

export default async function CheckoutPage() {
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

  const products = uniqueProducts.map(getProductData);

  return <ClientCheckout products={products} />;
}
