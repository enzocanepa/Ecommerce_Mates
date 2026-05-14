import { apiRequest } from './api';

export const productService = {
    getProducts() {
        return apiRequest('/api/products');
    },
};
