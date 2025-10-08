import styles from "./page.module.css";
import { fetchProducts, getProductData } from "./api/products";
import ClientCart from "./components/ClientCart";
import { defaultLocale } from "./lib/i18n";

export default async function Home() {
  const apiProducts = await fetchProducts();
  const products = apiProducts.map((product) =>
    getProductData(product, defaultLocale)
  );

  return (
    <main className={styles.main}>
      <ClientCart products={products} locale={defaultLocale} />
    </main>
  );
}
