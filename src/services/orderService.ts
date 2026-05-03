import { apiRequest } from './api';
import type { CartItem, Order } from '../app/types';

interface CreateOrderResponse {
  order: Order;
}

interface OrdersResponse {
  orders: Order[];
}

export const orderService = {
  createOrder(cart: CartItem[], total: number, token: string): Promise<CreateOrderResponse> {
    return apiRequest<CreateOrderResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify({ cart, total }),
    }, token);
  },

  getOrders(token: string): Promise<OrdersResponse> {
    return apiRequest<OrdersResponse>('/orders', undefined, token);
  },

  getAllOrders(token: string): Promise<OrdersResponse> {
    return apiRequest<OrdersResponse>('/admin/orders', undefined, token);
  },
};
