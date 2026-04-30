export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
}

export type ProductCategory = 'mates' | 'bombillas' | 'yerba' | 'accesorios';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  images?: string[];
  fullDescription?: string;
  stock?: number;
  variants?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export type OrderStatus = 'pending' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}
