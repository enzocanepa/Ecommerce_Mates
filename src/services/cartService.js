import { apiRequest } from './api';

export const cartService = {
    getCart(token) {
        return apiRequest('/api/cart', undefined, token);
    },
    saveCart(items, token) {
        return apiRequest('/api/cart', {
            method: 'POST',
            body: JSON.stringify({ items }),
        }, token);
    },
};
