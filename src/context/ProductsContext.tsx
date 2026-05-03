import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { products as staticProducts } from '../data/products';
import { productService } from '../services/productService';
import type { Product } from '../types';

const LOCAL_PRODUCTS_KEY = 'mate_admin_products';

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  refreshProducts: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

function loadLocalProducts(): Product[] | null {
  try {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => loadLocalProducts() ?? staticProducts);
  const [loading, setLoading] = useState(false);

  const refreshProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      if (Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);
        return;
      }
    } catch { /* fallback below */ } finally {
      setLoading(false);
    }
    setProducts(loadLocalProducts() ?? staticProducts);
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

export async function adminSaveProducts(products: Product[], token?: string | null): Promise<void> {
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));
  if (!token) return;

  try {
    await productService.saveProducts(products, token);
  } catch (err) {
    console.warn('Edge Function save failed:', err);
  }
}
