"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import styles from "./page.module.css";
import { products } from "./items";

const ItemCount = ({ count, name }: { count: number; name: string }) => {
  return (
    <div key={name}>
      {name} count: {count}
    </div>
  );
};

export default function Home() {
  const [cartItems, setCartItems] = useState<
    {
      id: React.Key | null | undefined;
      name: string;
      quantity: number;
    }[]
  >([]);

  useEffect(() => {
    const savedCart = Cookies.get("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error("Error parsing cart from cookie:", error);
      }
    }
  }, []);

  const addToCart = (product: string) => {
    const alreadyInCart = cartItems.find((item) => item.name === product);
    let updatedCart;
    if (alreadyInCart) {
      updatedCart = cartItems.map((item) =>
        item.name === product ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cartItems, { id: product, name: product, quantity: 1 }];
    }
    setCartItems(updatedCart);
    Cookies.set("cart", JSON.stringify(updatedCart), { expires: 7 });
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getCheckoutUrl = () => {
    return "/checkout";
  };

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>Michael&apos;s Amazing Web Store</p>
        <div>
          <Link href={getCheckoutUrl()} className={styles.basket}>
            Basket: {totalItems} items
          </Link>
          {cartItems.map((product) => (
            <ItemCount
              key={product.id}
              name={product.name}
              count={product.quantity}
            />
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {products.map((product) => (
          <button
            key={product.id}
            className={styles.card}
            onClick={() => addToCart(product.id)}
            aria-label="Add to basket"
          >
            <h2>
              {product.id} <span>-&gt;</span>
            </h2>
            <p>{product.description}</p>
          </button>
        ))}
      </div>
    </main>
  );
}
