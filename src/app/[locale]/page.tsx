import { notFound } from "next/navigation";
import styles from "../page.module.css";
import { fetchProducts, getProductData } from "../api/products";
import ClientCart from "../components/ClientCart";
import {
  supportedLocales,
  Locale,
  getCountryName,
  getCurrency,
} from "../lib/i18n";

interface LocalePageProps {
  params: {
    locale: string;
  };
}

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({
    locale: locale,
  }));
}

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = params;

  if (!supportedLocales.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;

  const apiProducts = await fetchProducts();
  const products = apiProducts.map((product) =>
    getProductData(product, typedLocale)
  );

  return (
    <main className={styles.main}>
      <ClientCart products={products} locale={typedLocale} />
    </main>
  );
}

export async function generateMetadata({ params }: LocalePageProps) {
  const { locale } = params;
  const countryName = getCountryName(locale as Locale);
  const currency = getCurrency(locale as Locale);

  return {
    title: `Michael's Amazing Web Store - ${countryName}`,
    description: `Shop amazing products in ${countryName} with prices in ${currency}`,
  };
}
