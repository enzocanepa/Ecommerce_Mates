import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { products as staticProducts } from '../data/products';
import { productService } from '../services/productService';

const ProductsContext = createContext(undefined);

export function ProductsProvider({ children }) {
    // Muestra productos estáticos de inmediato mientras carga la API
    const [products, setProducts] = useState(staticProducts);
    const [loading,  setLoading]  = useState(true);

    const refreshProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await productService.getProducts();
            // Siempre usar el estado real de la DB cuando la API responde
            if (Array.isArray(data.products))
                setProducts(data.products);
        } catch {
            // Backend no disponible — mantiene el estado actual (estáticos o última carga)
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
