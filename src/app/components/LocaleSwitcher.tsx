"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supportedLocales, defaultLocale } from "../lib/i18n";

export default function LocaleSwitcher() {
  const pathname = usePathname();

  if (process.env.NODE_ENV === "test") {
    return null;
  }

  const currentLocale =
    supportedLocales.find((locale) => pathname.startsWith(`/${locale}`)) ||
    defaultLocale;

  const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "") || "/";

  return (
    <div style={{ padding: "10px", display: "flex", gap: "10px" }}>
      <Link
        href={pathWithoutLocale}
        style={{
          padding: "8px 12px",
          textDecoration: "none",
          backgroundColor: currentLocale === "uk" ? "#007acc" : "#e0e0e0",
          color: currentLocale === "uk" ? "white" : "#333",
        }}
      >
        £ UK
      </Link>
      <Link
        href={`/us${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`}
        style={{
          padding: "8px 12px",
          textDecoration: "none",
          backgroundColor: currentLocale === "us" ? "#007acc" : "#e0e0e0",
          color: currentLocale === "us" ? "white" : "#333",
        }}
      >
        $ US
      </Link>
    </div>
  );
}
