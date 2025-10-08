"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import styles from "../checkout/page.module.css";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface ClientCheckoutProps {
  products: Product[];
}

export default function ClientCheckout({ products }: ClientCheckoutProps) {
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
      price: productDetails?.price || 0,
      stock: productDetails?.stock || 0,
    };
  });

  const totalPrice = cartItemsWithDetails.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
              <div className={styles.totalPrice}>
                Total Price: <strong>£{totalPrice.toFixed(2)}</strong>
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
                    <div className={styles.itemPrice}>
                      Unit Price: £{item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className={styles.itemQuantity}>
                    <span className={styles.quantityLabel}>Quantity:</span>
                    <span className={styles.quantityValue}>
                      {item.quantity}
                    </span>
                  </div>
                  <div className={styles.itemTotal}>
                    Subtotal: £{(item.price * item.quantity).toFixed(2)}
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
