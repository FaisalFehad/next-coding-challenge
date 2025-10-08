"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../page.module.css";
import { fetchMoreProductsClient, getProductData } from "../api/products";
import {
  Locale,
  defaultLocale,
  getCartText,
  getCheckoutUrl,
} from "../lib/i18n";
import { CartItem, Product } from "../lib/types";
import {
  getCartFromCookies,
  saveCartToCookies,
  addItemToCart,
  getTotalItems,
} from "../lib/cart-utils";
import LocaleSwitcher from "./LocaleSwitcher";

const ItemCount = ({ count, name }: { count: number; name: string }) => {
  return (
    <div key={name}>
      {name} count: {count}
    </div>
  );
};

interface ClientCartProps {
  products: Product[];
  locale?: Locale;
}

export default function ClientCart({
  products: initialProducts,
  locale = defaultLocale,
}: ClientCartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loadingMoreProducts, setLoadingMoreProducts] = useState(false);
  const [moreProductsLoaded, setMoreProductsLoaded] = useState(false);

  const cartText = getCartText(locale);

  useEffect(() => {
    setCartItems(getCartFromCookies());
  }, []);

  useEffect(() => {
    if (!moreProductsLoaded && process.env.NODE_ENV !== "test") {
      setLoadingMoreProducts(true);
      fetchMoreProductsClient()
        .then((moreProducts) => {
          const transformedProducts = moreProducts.map((product) =>
            getProductData(product, locale)
          );
          const uniqueProducts = transformedProducts.filter(
            (newProduct) =>
              !products.some((existing) => existing.id === newProduct.id)
          );
          setProducts((prev) => [...prev, ...uniqueProducts]);
          setMoreProductsLoaded(true);
        })
        .catch((error) => {
          console.error("Failed to load additional products:", error);
        })
        .finally(() => {
          setLoadingMoreProducts(false);
        });
    }
  }, [products, moreProductsLoaded, locale]);

  const addToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const updatedCart = addItemToCart(cartItems, productId, product.name);
    setCartItems(updatedCart);
    saveCartToCookies(updatedCart);
  };

  const totalItems = getTotalItems(cartItems);
  const checkoutUrl = getCheckoutUrl(locale);

  return (
    <>
      <LocaleSwitcher />
      <div className={styles.description}>
        <p>Michael&apos;s Amazing Web Store</p>
        <div>
          <Link href={checkoutUrl} className={styles.basket}>
            {cartText}: {totalItems} {totalItems === 1 ? "item" : "items"}
          </Link>
          {cartItems.map((item) => (
            <ItemCount key={item.id} name={item.name} count={item.quantity} />
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {products.map((product) => (
          <button
            key={product.id}
            className={styles.card}
            onClick={() => addToCart(product.id)}
            aria-label={`Add to Cart ${
              product.name
            } to ${cartText.toLowerCase()}`}
            disabled={product.stock === 0}
          >
            <h2>
              {product.name} <span>-&gt;</span>
            </h2>
            <p>{product.description}</p>
            {product.stock === 0 && (
              <p style={{ color: "red", fontWeight: "bold" }}>Out of Stock</p>
            )}
          </button>
        ))}

        {loadingMoreProducts && (
          <div
            className={styles.card}
            style={{ opacity: 0.6, cursor: "default" }}
          >
            <h2>Loading more products...</h2>
          </div>
        )}
      </div>
    </>
  );
}
