import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '../services/cartService';

const LOCAL_CART_KEY = 'mateShopCart';
const CartContext = createContext(undefined);

function loadLocalCart() {
    try {
        return JSON.parse(localStorage.getItem(LOCAL_CART_KEY) ?? '[]');
    } catch {
        return [];
    }
}

export function CartProvider({ children }) {
    const { user, accessToken } = useAuth();
    const [cart, setCart]               = useState([]);
    const [initialized, setInitialized] = useState(false);

    // ── Initialize / re-sync cuando cambia la sesión ──────────────────────────
    useEffect(() => {
        setInitialized(false);
        const init = async () => {
            if (user && accessToken) {
                try {
                    const data = await cartService.getCart(accessToken);
                    const raw = data.cart ?? [];
                    const backendCart = typeof raw === 'string' ? JSON.parse(raw) : raw;
                    const localCart   = loadLocalCart();

                    if (localCart.length > 0) {
                        const merged = [...backendCart];
                        for (const local of localCart) {
                            const existing = merged.find(i => i.id === local.id);
                            if (existing) existing.quantity += local.quantity;
                            else merged.push(local);
                        }
                        setCart(merged);
                        localStorage.removeItem(LOCAL_CART_KEY);
                        cartService.saveCart(merged, accessToken).catch(() => {});
                    } else {
                        setCart(backendCart);
                    }
                    setInitialized(true);
                    return;
                } catch { /* fallback to localStorage */ }
            }
            setCart(loadLocalCart());
            setInitialized(true);
        };
        init();
    }, [user, accessToken]);

    // ── Persistir cambios ─────────────────────────────────────────────────────
    useEffect(() => {
        if (!initialized) return;
        if (user && accessToken) {
            cartService.saveCart(cart, accessToken).catch(() => {});
        } else {
            localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
        }
    }, [cart, initialized, user, accessToken]);

    // ── Acciones ──────────────────────────────────────────────────────────────
    const addToCart = (product, quantity = 1) => {
        const item = {
            id:       product.id,
            name:     product.name,
            price:    product.price,
            image:    product.image,
            category: product.category,
            stock:    product.stock,
        };
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing)
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i);
            return [...prev, { ...item, quantity }];
        });
    };

    const removeFromCart = productId => setCart(prev => prev.filter(i => i.id !== productId));

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) { removeFromCart(productId); return; }
        setCart(prev => prev.map(i => i.id === productId ? { ...i, quantity } : i));
    };

    const clearCart = () => setCart([]);

    const checkout = async () => {
        if (!user)        throw new Error('Debes iniciar sesión para realizar una compra');
        if (!accessToken) throw new Error('No hay token de autenticación');
        const { orderService } = await import('../services/orderService');
        await orderService.createOrder(cart, totalPrice, accessToken);
        clearCart();
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
