import { apiRequest } from './api';

export const orderService = {
    createOrder(cart, total, token) {
        return apiRequest('/api/orders', {
            method: 'POST',
            body: JSON.stringify({ cart, total }),
        }, token);
    },
    getOrders(token) {
        return apiRequest('/api/orders', undefined, token);
    },
    getAllOrders(token) {
        return apiRequest('/api/orders/admin', undefined, token);
    },
    updateOrderStatus(id, status, token) {
        return apiRequest(`/api/orders/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        }, token);
    },
};
