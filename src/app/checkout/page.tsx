"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import styles from "./page.module.css";
import { products } from "../items";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
}

function CheckoutContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = Cookies.get("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error("Failed to parse cart data from cookie:", error);
      }
    }
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const cartItemsWithDetails = cartItems.map((cartItem) => {
    const productDetails = products.find(
      (product) => product.id === cartItem.id
    );
    return {
      ...cartItem,
      description: productDetails?.description || "Unknown product",
    };
  });

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1>Checkout</h1>
        <Link href="/" className={styles.backLink}>
          ← Back to Store
        </Link>
      </div>

      <div className={styles.content}>
        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <h2>Your cart is empty</h2>
            <p>Add some items to your cart before checking out.</p>
            <Link href="/" className={styles.shopButton}>
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
            </div>

            <div className={styles.cartItems}>
              <h3>Items in your cart:</h3>
              {cartItemsWithDetails.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemDetails}>
                    <h4 className={styles.itemName}>{item.name}</h4>
                    <p className={styles.itemDescription}>{item.description}</p>
                    <div className={styles.itemId}>Product ID: {item.id}</div>
                  </div>
                  <div className={styles.itemQuantity}>
                    <span className={styles.quantityLabel}>Quantity:</span>
                    <span className={styles.quantityValue}>
                      {item.quantity}
                    </span>
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

export default function CheckoutPage() {
  return <CheckoutContent />;
}
