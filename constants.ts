
import { Product, Category, Order } from './types';

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'All', icon: '🛍️' },
  { id: 'vegetables', name: 'Vegetables & Fruits', icon: '🥦' },
  { id: 'dairy', name: 'Dairy, Bread & Eggs', icon: '🥛' },
  { id: 'snacks', name: 'Snacks & Munchies', icon: '🥨' },
  { id: 'drinks', name: 'Cold Drinks & Juices', icon: '🥤' },
  { id: 'instant', name: 'Instant & Frozen Food', icon: '🍜' },
  { id: 'personal', name: 'Personal Care', icon: '🧼' },
  { id: 'cleaning', name: 'Cleaning Essentials', icon: '🧽' },
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Amul Taaza Toned Milk',
    price: 27,
    originalPrice: 28,
    weight: '500 ml',
    image: 'https://images.unsplash.com/photo-1550583724-1255d1426639?w=300&h=300&fit=crop',
    category: 'dairy',
    brand: 'Amul',
    discount: '4% OFF'
  },
  {
    id: '2',
    name: 'Fresh Organic Tomatoes',
    price: 45,
    originalPrice: 60,
    weight: '500 g',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f02bad67b?w=300&h=300&fit=crop',
    category: 'vegetables',
    brand: 'Fresh',
    discount: '25% OFF'
  },
  {
    id: '3',
    name: 'Lay\'s India\'s Magic Masala',
    price: 20,
    weight: '50 g',
    image: 'https://images.unsplash.com/photo-1566478431375-7049b1133f4b?w=300&h=300&fit=crop',
    category: 'snacks',
    brand: 'Lays'
  },
  {
    id: '4',
    name: 'Coca-Cola Zero Sugar',
    price: 40,
    originalPrice: 45,
    weight: '300 ml',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=300&fit=crop',
    category: 'drinks',
    brand: 'Coca-Cola',
    discount: '11% OFF'
  },
  {
    id: '5',
    name: 'Maggi 2-Minute Noodles',
    price: 96,
    weight: '420 g',
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=300&h=300&fit=crop',
    category: 'instant',
    brand: 'Maggi'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-101',
    userId: 'user-1',
    userName: 'John Doe',
    items: [],
    total: 450,
    status: 'delivered',
    timestamp: Date.now() - 86400000,
    address: 'Sector 45, Gurugram',
    paymentMethod: 'UPI'
  }
];
