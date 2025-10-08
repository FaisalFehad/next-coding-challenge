export type Locale = "uk" | "us";

export const supportedLocales: Locale[] = ["uk", "us"];
export const defaultLocale: Locale = "uk";

export function formatCurrency(amount: number, locale: Locale): string {
  if (locale === "us") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}

export function getCartText(locale: Locale): string {
  return locale === "us" ? "Cart" : "Basket";
}

export function getCartTextLowercase(locale: Locale): string {
  return getCartText(locale).toLowerCase();
}

export function getHomeUrl(locale: Locale): string {
  return locale === "us" ? "/us" : "/";
}

export function getCheckoutUrl(locale: Locale): string {
  return locale === "us" ? "/us/checkout" : "/checkout";
}

export function getCountryName(locale: Locale): string {
  return locale === "us" ? "United States" : "United Kingdom";
}

export function getCurrency(locale: Locale): string {
  return locale === "us" ? "USD" : "GBP";
}
