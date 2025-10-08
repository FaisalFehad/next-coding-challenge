import { fetchProducts, getProductData } from "../api/products";
import ClientCheckout from "../components/ClientCheckout";

export default async function CheckoutPage() {
  const apiProducts = await fetchProducts();
  const products = apiProducts.map(getProductData);

  return <ClientCheckout products={products} />;
}
