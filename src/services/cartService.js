import { apiRequest } from './api';
export const cartService = {
    getCart(token) {
        return apiRequest('/cart', undefined, token);
    },
    saveCart(cart, token) {
        return apiRequest('/cart', {
            method: 'POST',
            body: JSON.stringify({ cart }),
        }, token);
    },
};
