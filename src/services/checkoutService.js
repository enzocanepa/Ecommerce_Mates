import { apiRequest } from './api';
export const checkoutService = {
    createPreference(items, payer, total, token) {
        return apiRequest('/checkout/create-preference', {
            method: 'POST',
            body: JSON.stringify({ items, payer, total }),
        }, token);
    },
};
