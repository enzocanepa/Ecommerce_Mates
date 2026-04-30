import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { products as staticProducts } from '../data/products';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import type { Product } from '../types';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-a8bad502`;
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
      const res = await fetch(`${BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
          return;
        }
      }
    } catch { /* fallback below */ } finally {
      setLoading(false);
    }
    // Fallback: localStorage override or static data
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

// Called from admin pages — saves to localStorage (local mode) and optionally to Edge Function
export async function adminSaveProducts(products: Product[], token?: string | null): Promise<void> {
  // Always persist locally so changes survive page reloads
  localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(products));

  if (!token) return; // Local-only save

  try {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ products }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      // Edge function returned an error but we already saved locally — don't throw
      console.warn('Edge Function save failed:', err.error);
    }
  } catch {
    // Network error — local save already done, nothing more to do
  }
}
