import { apiRequest } from './api';
import type { CartItem } from '../app/types';

interface CartResponse {
  cart: CartItem[];
}

export const cartService = {
  getCart(token: string): Promise<CartResponse> {
    return apiRequest<CartResponse>('/cart', undefined, token);
  },

  saveCart(cart: CartItem[], token: string): Promise<void> {
    return apiRequest<void>('/cart', {
      method: 'POST',
      body: JSON.stringify({ cart }),
    }, token);
  },
};
