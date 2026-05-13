import { apiRequest } from './api';

export const productService = {
    getProducts() {
        return apiRequest('/api/products');
    },
    saveProducts(products, token) {
        return apiRequest('/api/products', {
            method: 'POST',
            body: JSON.stringify({ products }),
        }, token);
    },
};
