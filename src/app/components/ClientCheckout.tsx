"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../checkout/page.module.css";
import {
  Locale,
  formatCurrency,
  defaultLocale,
  getCartTextLowercase,
  getHomeUrl,
} from "../lib/i18n";
import { CartItem, Product } from "../lib/types";
import {
  getCartFromCookies,
  getTotalItems,
  getCartItemsWithDetails,
  getTotalPrice,
} from "../lib/cart-utils";
import LocaleSwitcher from "./LocaleSwitcher";

interface ClientCheckoutProps {
  products: Product[];
  locale?: Locale;
}

export default function ClientCheckout({
  products,
  locale = defaultLocale,
}: ClientCheckoutProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const cartText = getCartTextLowercase(locale);
  const homeUrl = getHomeUrl(locale);

  useEffect(() => {
    setCartItems(getCartFromCookies());
  }, []);

  const totalItems = getTotalItems(cartItems);
  const cartItemsWithDetails = getCartItemsWithDetails(cartItems, products);
  const totalPrice = getTotalPrice(cartItemsWithDetails);

  return (
    <main className={styles.main}>
      <LocaleSwitcher />
      <div className={styles.header}>
        <h1>Checkout</h1>
        <Link href={homeUrl} className={styles.backLink}>
          ← Back to Store
        </Link>
      </div>

      <div className={styles.content}>
        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <h2>Your {cartText} is empty</h2>
            <p>Add some items to your {cartText} before checking out.</p>
            <Link href={homeUrl} className={styles.shopButton}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.cartSummary}>
              <h2>Order Summary</h2>
              <div className={styles.totalItems}>
                Total Items: <strong>{totalItems}</strong>
              </div>
              <div className={styles.totalPrice}>
                Total Price:{" "}
                <strong>{formatCurrency(totalPrice, locale)}</strong>
              </div>
            </div>

            <div className={styles.cartItems}>
              <h3>Items in your {cartText}:</h3>
              {cartItemsWithDetails.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemDetails}>
                    <h4 className={styles.itemName}>{item.name}</h4>
                    <p className={styles.itemDescription}>{item.description}</p>
                    <div className={styles.itemId}>Product ID: {item.id}</div>
                    <div className={styles.itemPrice}>
                      Unit Price: {formatCurrency(item.price, locale)}
                    </div>
                  </div>
                  <div className={styles.itemQuantity}>
                    <span className={styles.quantityLabel}>Quantity:</span>
                    <span className={styles.quantityValue}>
                      {item.quantity}
                    </span>
                  </div>
                  <div className={styles.itemTotal}>
                    Subtotal:{" "}
                    {formatCurrency(item.price * item.quantity, locale)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
