import { apiRequest } from './api';
import { supabaseAnonKey } from '../lib/supabase';
export const productService = {
    getProducts() {
        return apiRequest('/products', undefined, supabaseAnonKey);
    },
    saveProducts(products, token) {
        return apiRequest('/products', {
            method: 'POST',
            body: JSON.stringify({ products }),
        }, token);
    },
};
