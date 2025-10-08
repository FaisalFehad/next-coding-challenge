import styles from "./page.module.css";
import { fetchProducts, getProductData } from "./api/products";
import ClientCart from "./components/ClientCart";

export default async function Home() {
  const apiProducts = await fetchProducts();
  const products = apiProducts.map(getProductData);

  return (
    <main className={styles.main}>
      <ClientCart products={products} />
    </main>
  );
}
