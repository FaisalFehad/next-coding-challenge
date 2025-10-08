export interface CartItem {
  id: string;
  name: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export interface CartItemWithDetails extends CartItem {
  description: string;
  price: number;
  stock: number;
}
