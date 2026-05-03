import { apiRequest } from './api';
import type { CartItem } from '../app/types';

interface CheckoutItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CheckoutPayerInfo {
  name: string;
  surname: string;
  email: string;
}

interface MercadoPagoPreference {
  preferenceId: string;
  initPoint: string;
}

export const checkoutService = {
  createPreference(
    items: CheckoutItem[],
    payer: CheckoutPayerInfo,
    total: number,
    token: string,
  ): Promise<MercadoPagoPreference> {
    return apiRequest<MercadoPagoPreference>('/checkout/create-preference', {
      method: 'POST',
      body: JSON.stringify({ items, payer, total }),
    }, token);
  },
};
