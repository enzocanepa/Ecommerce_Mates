import { apiRequest } from './api';
export const orderService = {
    createOrder(cart, total, token) {
        return apiRequest('/orders', {
            method: 'POST',
            body: JSON.stringify({ cart, total }),
        }, token);
    },
    getOrders(token) {
        return apiRequest('/orders', undefined, token);
    },
    getAllOrders(token) {
        return apiRequest('/admin/orders', undefined, token);
    },
};
