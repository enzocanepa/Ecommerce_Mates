import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link, useLocation } from 'react-router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getBaseUrl } from '../services/api';
import { CheckCircle, XCircle, Clock, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
const BASE_URL = getBaseUrl();
const LOCAL_PRODUCTS_KEY = 'mate_admin_products';
const LOCAL_ORDERS_KEY = 'mate_local_orders';
const RESULTS = {
    success: {
        icon: CheckCircle,
        iconClass: 'text-green-500',
        title: '¡Pago aprobado!',
        description: 'Tu pedido fue confirmado y está siendo preparado. Recibirás un email de confirmación.',
        orderStatus: 'completed',
    },
    pending: {
        icon: Clock,
        iconClass: 'text-yellow-500',
        title: 'Pago en proceso',
        description: 'Tu pago está siendo verificado. Te notificaremos cuando se confirme.',
        orderStatus: 'pending',
    },
    failure: {
        icon: XCircle,
        iconClass: 'text-red-500',
        title: 'Pago rechazado',
        description: 'No pudimos procesar tu pago. Podés volver al carrito e intentarlo nuevamente.',
        orderStatus: 'cancelled',
    },
};
function decrementStock(items) {
    try {
        const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
        if (!raw)
            return;
        const products = JSON.parse(raw);
        if (!Array.isArray(products))
            return;
        const updated = products.map((p) => {
            const ordered = items.find((i) => i.id === p.id);
            if (!ordered)
                return p;
            return { ...p, stock: Math.max(0, (p.stock ?? 0) - ordered.quantity) };
        });
        localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
    }
    catch { /* ignore */ }
}
export function CheckoutResult() {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { cart, totalPrice, clearCart } = useCart();
    const { accessToken, user } = useAuth();
    const [orderCreated, setOrderCreated] = useState(false);
    const [orderError, setOrderError] = useState('');
    const orderAttempted = useRef(false);
    const path = location.pathname;
    let resultType = 'failure';
    if (path.includes('exito'))
        resultType = 'success';
    else if (path.includes('pendiente'))
        resultType = 'pending';
    const config = RESULTS[resultType];
    const Icon = config.icon;
    const paymentId = searchParams.get('payment_id');
    const externalRef = searchParams.get('external_reference');
    // Persist cart before MP redirect wipes it
    useEffect(() => {
        if (cart.length > 0) {
            sessionStorage.setItem('checkoutCart', JSON.stringify(cart));
            sessionStorage.setItem('checkoutTotal', String(totalPrice));
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    // Create order and clear cart on success/pending
    useEffect(() => {
        if (orderAttempted.current)
            return;
        if (resultType === 'failure')
            return;
        if (orderCreated)
            return;
        orderAttempted.current = true;
        const createOrder = async () => {
            const itemsToSave = cart.length > 0
                ? cart
                : JSON.parse(sessionStorage.getItem('checkoutCart') ?? '[]');
            const totalToSave = cart.length > 0
                ? totalPrice
                : Number(sessionStorage.getItem('checkoutTotal') ?? 0);
            const cleanup = () => {
                clearCart();
                sessionStorage.removeItem('checkoutCart');
                sessionStorage.removeItem('checkoutTotal');
                setOrderCreated(true);
            };
            if (itemsToSave.length === 0) {
                cleanup();
                return;
            }
            // Try Edge Function (real Supabase auth)
            if (accessToken) {
                try {
                    const res = await fetch(`${BASE_URL}/api/orders`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify({
                            cart: itemsToSave,
                            total: totalToSave,
                            status: config.orderStatus,
                            paymentId,
                            externalReference: externalRef,
                        }),
                    });
                    if (res.ok) {
                        cleanup();
                        return;
                    }
                }
                catch { /* fall through */ }
            }
            // Local fallback
            const existing = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) ?? '[]');
            const order = {
                id: crypto.randomUUID(),
                userId: user?.id ?? 'local',
                userEmail: user?.email ?? '',
                items: itemsToSave,
                total: totalToSave,
                status: config.orderStatus,
                createdAt: new Date().toISOString(),
            };
            localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify([order, ...existing]));
            // Decrement stock
            decrementStock(itemsToSave);
            // Simulated email notification (Edge Function not deployed)
            if (user?.email) {
                toast.success(`📧 Email de confirmación enviado a ${user.email}`, {
                    description: `Pedido #${order.id.slice(0, 8)} — $${totalToSave.toLocaleString('es-AR')} ARS`,
                    duration: 6000,
                });
            }
            cleanup();
        };
        createOrder();
    }, [resultType]); // eslint-disable-line react-hooks/exhaustive-deps
    return (<div className="py-20 bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <Icon className={`w-20 h-20 mx-auto mb-5 ${config.iconClass}`}/>

          <h1 className="text-2xl font-bold text-gray-800 mb-3">{config.title}</h1>
          <p className="text-gray-500 mb-6">{config.description}</p>

          {paymentId && (<div className="bg-gray-50 rounded-lg px-4 py-3 text-left mb-6">
              <p className="text-xs text-gray-500 mb-1">ID de pago</p>
              <p className="text-sm font-mono text-gray-700">{paymentId}</p>
            </div>)}

          {orderError && (<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {orderError}
            </div>)}

          <div className="flex flex-col gap-3">
            {resultType !== 'failure' ? (<Link to="/pedidos" className="flex items-center justify-center gap-2 bg-[#c7e47d] text-[#4a5f2f] py-3 rounded-xl font-semibold hover:bg-[#b8d66e] transition-colors">
                <ShoppingBag className="w-5 h-5"/>
                Ver mis pedidos
              </Link>) : (<Link to="/carrito" className="flex items-center justify-center gap-2 bg-[#c7e47d] text-[#4a5f2f] py-3 rounded-xl font-semibold hover:bg-[#b8d66e] transition-colors">
                Volver al carrito
              </Link>)}
            <Link to="/tienda" className="text-[#6b8e3d] hover:text-[#4a5f2f] py-2 transition-colors text-sm">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>);
}
