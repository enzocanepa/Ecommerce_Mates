import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';

const ProductsContext = createContext(undefined);

export function ProductsProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [loading,  setLoading]  = useState(true);

    const refreshProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await productService.getProducts();
            if (Array.isArray(data.products))
                setProducts(data.products);
        } catch {
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshProducts();
    }, [refreshProducts]);

    return (
        <ProductsContext.Provider value={{ products, loading, refreshProducts }}>
            {children}
        </ProductsContext.Provider>
    );
}

export function useProducts() {
    const ctx = useContext(ProductsContext);
    if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
    return ctx;
}
