"use client";
import { useState } from "react";
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

  const addToCart = (product: string) => {
    const alreadyInCart = cartItems.find((item) => item.name === product);
    if (alreadyInCart) {
      setCartItems(
        cartItems.map((item) =>
          item.name === product
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { id: product, name: product, quantity: 1 }]);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>Michael&apos;s Amazing Web Store</p>
        <div>
          <button className={styles.basket}>Basket: {totalItems} items</button>
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
