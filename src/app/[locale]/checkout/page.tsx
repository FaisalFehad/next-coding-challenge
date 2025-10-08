import { notFound } from "next/navigation";
import ClientCheckout from "../../components/ClientCheckout";
import { supportedLocales, Locale } from "../../lib/i18n";
import { fetchAllProducts } from "../../lib/product-utils";

interface LocaleCheckoutPageProps {
  params: {
    locale: string;
  };
}

export default async function LocaleCheckoutPage({
  params,
}: LocaleCheckoutPageProps) {
  const { locale } = params;

  if (!supportedLocales.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const products = await fetchAllProducts(typedLocale);

  return <ClientCheckout products={products} locale={typedLocale} />;
}
