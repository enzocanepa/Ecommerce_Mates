import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { cartService } from '../services/cartService';

const LOCAL_CART_KEY = 'mateShopCart';
const ABANDONED_CART_DELAY = 15 * 60 * 1000; // 15 minutos
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
    const [isCartOpen, setIsCartOpen]   = useState(false);
    const abandonedCartTimer = useRef(null);

    const openCart  = useCallback(() => setIsCartOpen(true),  []);
    const closeCart = useCallback(() => setIsCartOpen(false), []);

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
            const newCart = existing 
                ? prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i)
                : [...prev, { ...item, quantity }];
                
            // B-03: debounce del webhook de carrito abandonado (15 min de inactividad)
            if (user) {
                clearTimeout(abandonedCartTimer.current);
                abandonedCartTimer.current = setTimeout(() => {
                    const total = newCart.reduce((s, i) => s + i.price * i.quantity, 0);
                    import('../services/n8nService').then(({ n8nService }) => {
                        n8nService.enviarCarritoAbandonado(user, newCart, total);
                    }).catch(err => console.error(err));
                }, ABANDONED_CART_DELAY);
            }
            
            return newCart;
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
        try {
            const { orderService } = await import('../services/orderService');
            // A-04: calcular total localmente para evitar usar el valor del render anterior
            const currentTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
            const res = await orderService.createOrder(cart, currentTotal, accessToken);
            
            // N8N Webhook: Compra Exitosa
            import('../services/n8nService').then(({ n8nService }) => {
                n8nService.enviarCompraExitosa(user, cart, totalPrice, res?.id || '');
            }).catch(err => console.error(err));
            
            clearCart();
        } catch (error) {
            // N8N Webhook: Compra Fallida
            import('../services/n8nService').then(({ n8nService }) => {
                n8nService.enviarCompraFallida(user, error.message);
            }).catch(err => console.error(err));
            throw error;
        }
    };

    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
    const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, checkout, totalItems, totalPrice, isCartOpen, openCart, closeCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
