import ClientCheckout from "../components/ClientCheckout";
import { defaultLocale } from "../lib/i18n";
import { fetchAllProducts } from "../lib/product-utils";

export default async function CheckoutPage() {
  const products = await fetchAllProducts(defaultLocale);
  return <ClientCheckout products={products} locale={defaultLocale} />;
}
