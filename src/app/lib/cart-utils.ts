import Cookies from "js-cookie";
import { CartItem, Product, CartItemWithDetails } from "./types";

export function getCartFromCookies(): CartItem[] {
  try {
    const savedCart = Cookies.get("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error("Error parsing cart from cookie:", error);
    return [];
  }
}

export function saveCartToCookies(cartItems: CartItem[]): void {
  Cookies.set("cart", JSON.stringify(cartItems), { expires: 7 });
}

export function addItemToCart(
  cartItems: CartItem[],
  productId: string,
  productName: string
): CartItem[] {
  const existingItem = cartItems.find((item) => item.id === productId);

  if (existingItem) {
    return cartItems.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
  }

  return [...cartItems, { id: productId, name: productName, quantity: 1 }];
}

export function getTotalItems(cartItems: CartItem[]): number {
  return cartItems.reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartItemsWithDetails(
  cartItems: CartItem[],
  products: Product[]
): CartItemWithDetails[] {
  return cartItems.map((cartItem) => {
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
}

export function getTotalPrice(
  cartItemsWithDetails: CartItemWithDetails[]
): number {
  return cartItemsWithDetails.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
}
