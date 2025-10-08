"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import styles from "../page.module.css";
import { fetchMoreProductsClient, getProductData } from "../api/products";

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

const ItemCount = ({ count, name }: { count: number; name: string }) => {
  return (
    <div key={name}>
      {name} count: {count}
    </div>
  );
};

interface ClientCartProps {
  products: Product[];
}

export default function ClientCart({
  products: initialProducts,
}: ClientCartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loadingMoreProducts, setLoadingMoreProducts] = useState(false);
  const [moreProductsLoaded, setMoreProductsLoaded] = useState(false);

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

  useEffect(() => {
    if (!moreProductsLoaded && process.env.NODE_ENV !== "test") {
      setLoadingMoreProducts(true);
      fetchMoreProductsClient()
        .then((moreProducts) => {
          const transformedProducts = moreProducts.map(getProductData);
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
  }, [products, moreProductsLoaded]);

  const addToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const alreadyInCart = cartItems.find((item) => item.id === productId);
    let updatedCart: CartItem[];

    if (alreadyInCart) {
      updatedCart = cartItems.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [
        ...cartItems,
        { id: productId, name: product.name, quantity: 1 },
      ];
    }

    setCartItems(updatedCart);
    Cookies.set("cart", JSON.stringify(updatedCart), { expires: 7 });
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getCheckoutUrl = () => {
    return "/checkout";
  };

  return (
    <>
      <div className={styles.description}>
        <p>Michael&apos;s Amazing Web Store</p>
        <div>
          <Link href={getCheckoutUrl()} className={styles.basket}>
            Basket: {totalItems} items
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
            aria-label={`Add ${product.name} to basket`}
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
