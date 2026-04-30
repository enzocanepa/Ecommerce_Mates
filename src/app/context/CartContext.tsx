import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '../types';
import { useAuth } from './AuthContext';
import { projectId } from '/utils/supabase/info';

const BACKEND = `https://${projectId}.supabase.co/functions/v1/make-server-a8bad502`;
const LOCAL_CART_KEY = 'mateShopCart';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  checkout: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadLocalCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_CART_KEY) ?? '[]');
  } catch {
    return [];
  }
}

async function saveCartToBackend(cart: CartItem[], token: string) {
  try {
    await fetch(`${BACKEND}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ cart }),
    });
  } catch { /* ignore network errors */ }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, accessToken } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  // ── Initialize ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (initialized) return;

    const init = async () => {
      // Real Supabase auth: try to load from backend and merge with localStorage
      if (user && accessToken) {
        try {
          const res = await fetch(`${BACKEND}/cart`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (res.ok) {
            const data = await res.json();
            const backendCart: CartItem[] = data.cart ?? [];
            const localCart = loadLocalCart();

            if (localCart.length > 0) {
              // Merge local into backend
              const merged = [...backendCart];
              for (const local of localCart) {
                const existing = merged.find(i => i.id === local.id);
                if (existing) existing.quantity += local.quantity;
                else merged.push(local);
              }
              setCart(merged);
              localStorage.removeItem(LOCAL_CART_KEY);
              saveCartToBackend(merged, accessToken);
            } else {
              setCart(backendCart);
            }
            setInitialized(true);
            return;
          }
        } catch { /* fall through to localStorage */ }
      }

      // Local auth or guest: use localStorage
      setCart(loadLocalCart());
      setInitialized(true);
    };

    init();
  }, [user, accessToken]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Persist ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!initialized) return;

    if (user && accessToken) {
      saveCartToBackend(cart, accessToken);
    } else {
      // Guest or local auth → localStorage
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
    }
  }, [cart, initialized]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Actions ───────────────────────────────────────────────────────────────
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(i => i.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCart(prev => prev.map(i => i.id === productId ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  const checkout = async () => {
    if (!user) throw new Error('Debes iniciar sesión para realizar una compra');
    if (!accessToken) throw new Error('No hay token de autenticación');
    const res = await fetch(`${BACKEND}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ cart, total: totalPrice }),
    });
    if (!res.ok) throw new Error('Error al procesar la compra');
    clearCart();
    return (await res.json()).order;
  };

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, checkout, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
