import { apiRequest } from './api';
import { supabaseAnonKey } from '../lib/supabase';
import type { Product } from '../app/types';

interface ProductsResponse {
  products: Product[];
}

export const productService = {
  getProducts(): Promise<ProductsResponse> {
    return apiRequest<ProductsResponse>('/products', undefined, supabaseAnonKey);
  },

  saveProducts(products: Product[], token: string): Promise<void> {
    return apiRequest<void>('/products', {
      method: 'POST',
      body: JSON.stringify({ products }),
    }, token);
  },
};
