
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  weight: string;
  image: string;
  category: string;
  brand: string;
  discount?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  address?: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  timestamp: number;
  address: string;
  paymentMethod: string;
}

export type AppView = 'home' | 'login' | 'register' | 'admin' | 'profile' | 'checkout';
