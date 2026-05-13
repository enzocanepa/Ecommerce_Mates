import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { products as staticProducts } from '../data/products';
import { productService } from '../services/productService';
const LOCAL_PRODUCTS_KEY = 'mate_admin_products';
const ProductsContext = createContext(undefined);
function loadLocalProducts() {
    try {
        const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
        if (!raw)
            return null;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
    }
    catch {
        return null;
    }
}
export function ProductsProvider({ children }) {
    const [products, setProducts] = useState(() => loadLocalProducts() ?? staticProducts);
    const [loading, setLoading] = useState(false);
    const refreshProducts = useCallback(async () => {
        try {
            setLoading(true);
            const data = await productService.getProducts();
            if (Array.isArray(data.products) && data.products.length > 0) {
                setProducts(data.products);
                return;
            }
        }
        catch { /* fallback below */ }
        finally {
            setLoading(false);
        }
        setProducts(loadLocalProducts() ?? staticProducts);
    }, []);
    useEffect(() => {
        refreshProducts();
    }, [refreshProducts]);
    return (<ProductsContext.Provider value={{ products, loading, refreshProducts }}>
      {children}
    </ProductsContext.Provider>);
}
export function useProducts() {
    const ctx = useContext(ProductsContext);
    if (!ctx)
        throw new Error('useProducts must be used within ProductsProvider');
    return ctx;
}
export async function adminSaveProducts(products, token) {
    localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
    if (!token)
        return;
    try {
        await productService.saveProducts(products, token);
    }
    catch (err) {
        console.warn('Edge Function save failed:', err);
    }
}
