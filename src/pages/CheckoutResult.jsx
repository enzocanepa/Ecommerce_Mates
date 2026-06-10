import { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link, useLocation, useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getBaseUrl } from '../services/api';
import { toast } from 'sonner';

const BASE_URL = getBaseUrl();
const LOCAL_PRODUCTS_KEY = 'mate_admin_products';
const LOCAL_ORDERS_KEY = 'mate_local_orders';
const serif = "'DM Serif Display', Georgia, serif";

function decrementStock(items) {
    try {
        const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
        if (!raw) return;
        const products = JSON.parse(raw);
        if (!Array.isArray(products)) return;
        const updated = products.map((p) => {
            const ordered = items.find((i) => i.id === p.id);
            if (!ordered) return p;
            return { ...p, stock: Math.max(0, (p.stock ?? 0) - ordered.quantity) };
        });
        localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(updated));
    } catch { /* ignore */ }
}

/* ── Pulsing ring animation ── */
const pulseStyle = `
@keyframes ma-pulse { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(1.35);opacity:0} }
@keyframes ma-draw  { to{stroke-dashoffset:0} }
.ma-ring { animation: ma-pulse 2s ease-out infinite; }
.ma-draw { stroke-dasharray:60; stroke-dashoffset:60; animation: ma-draw .6s .25s ease forwards; }
@media(prefers-reduced-motion:reduce){ .ma-ring{animation:none;opacity:0} .ma-draw{animation:none;stroke-dashoffset:0} }
.ma-tl-label { font-size:12.5px; font-weight:700; line-height:1.25; text-align:center; white-space:nowrap; }
.ma-tl-sub   { font-size:11px; color:#6c7062; white-space:nowrap; }
@media(max-width:400px){
  .ma-tl-label { font-size:10px; }
  .ma-tl-sub   { font-size:9.5px; }
}
`;

/* ── Timeline step ── */
function TimelineStep({ done, icon, label, sub, isFirst }) {
    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative' }}>
            {!isFirst && (
                <div style={{ position: 'absolute', top: 17, left: '-50%', width: '100%', height: 2, background: done ? '#566a2f' : '#e0ddcf', zIndex: 0 }} />
            )}
            <span style={{
                width: 34, height: 34, borderRadius: '50%', display: 'grid', placeItems: 'center', zIndex: 1, flexShrink: 0,
                background: done ? '#566a2f' : '#e7e4d6',
                color: done ? '#f3efe0' : '#6c7062',
            }}>
                {icon}
            </span>
            <span className="ma-tl-label" style={{ color: done ? '#22261d' : '#6c7062' }}>{label}</span>
            <span className="ma-tl-sub">{sub}</span>
        </div>
    );
}

/* ── Info row ── */
function InfoRow({ label, value, valueStyle, truncate }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '7px 0', borderTop: '1px solid rgba(34,38,29,.10)' }}>
            <span style={{ fontSize: 13, color: '#6c7062', fontWeight: 600, flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: '14.5px', fontWeight: 700, minWidth: 0, ...(truncate ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } : { whiteSpace: 'nowrap' }), ...valueStyle }}>{value}</span>
        </div>
    );
}

export function CheckoutResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { cart, totalPrice, clearCart, openCart } = useCart();
    const { accessToken, user } = useAuth();
    const [orderCreated, setOrderCreated] = useState(false);
    const orderAttempted = useRef(false);

    const path = location.pathname;
    let resultType = 'failure';
    if (path.includes('exito')) resultType = 'success';
    else if (path.includes('pendiente')) resultType = 'pending';

    const isOk = resultType !== 'failure';
    const paymentId = searchParams.get('payment_id') ?? searchParams.get('payment_id');
    const externalRef = searchParams.get('external_reference');

    const orderStatus = resultType === 'success' ? 'completed' : resultType === 'pending' ? 'pending' : 'cancelled';

    // Persist cart before MP redirect wipes it
    useEffect(() => {
        if (cart.length > 0) {
            sessionStorage.setItem('checkoutCart', JSON.stringify(cart));
            sessionStorage.setItem('checkoutTotal', String(totalPrice));
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Create order and clear cart on success/pending
    useEffect(() => {
        if (orderAttempted.current) return;
        if (resultType === 'failure') return;
        if (orderCreated) return;
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

            if (itemsToSave.length === 0) { cleanup(); return; }

            if (accessToken) {
                try {
                    const res = await fetch(`${BASE_URL}/api/orders`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
                        body: JSON.stringify({ cart: itemsToSave, total: totalToSave, status: orderStatus, paymentId, externalReference: externalRef }),
                    });
                    if (res.ok) { cleanup(); return; }
                } catch { /* fall through */ }
            }

            // Local fallback
            const existing = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) ?? '[]');
            const order = {
                id: crypto.randomUUID(),
                userId: user?.id ?? 'local',
                userEmail: user?.email ?? '',
                items: itemsToSave,
                total: totalToSave,
                status: orderStatus,
                createdAt: new Date().toISOString(),
            };
            localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify([order, ...existing]));
            decrementStock(itemsToSave);

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

    const fmt = n => '$' + Number(n).toLocaleString('es-AR');

    return (
        <div style={{ background: '#f6f4ec', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '56px 28px' }}>
            <style>{pulseStyle}</style>

            <div style={{ width: '100%', maxWidth: 560, background: '#fff', border: '1px solid rgba(34,38,29,.10)', borderRadius: 24, boxShadow: '0 10px 30px rgba(34,38,29,.12)', overflow: 'hidden' }}>

                {/* Top band */}
                <div style={{
                    height: 8,
                    background: isOk
                        ? 'linear-gradient(90deg,#3f8f4e,#5bab68)'
                        : 'linear-gradient(90deg,#c0392b,#e0654f)',
                }} />

                <div style={{ padding: '44px 44px 40px', textAlign: 'center' }}>

                    {/* Icon badge */}
                    <div style={{
                        width: 96, height: 96, borderRadius: '50%', display: 'grid', placeItems: 'center',
                        margin: '0 auto 26px', position: 'relative',
                        background: isOk ? '#e7f2e3' : '#fbe9e6',
                    }}>
                        <span className="ma-ring" style={{
                            position: 'absolute', inset: 0, borderRadius: '50%',
                            border: `2px solid ${isOk ? '#3f8f4e' : '#c0392b'}`,
                        }} />
                        {isOk ? (
                            <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#3f8f4e" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path className="ma-draw" d="m8 12 3 3 5-6" />
                            </svg>
                        ) : (
                            <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path className="ma-draw" d="m15 9-6 6" />
                                <path className="ma-draw" d="m9 9 6 6" />
                            </svg>
                        )}
                    </div>

                    {/* Title & subtitle */}
                    <h1 style={{ fontFamily: serif, fontSize: 'clamp(28px,5vw,34px)', lineHeight: 1.16, letterSpacing: '-.3px', marginBottom: 10 }}>
                        {isOk ? '¡Pago aprobado!' : 'No pudimos procesar tu pago'}
                    </h1>
                    <p style={{ fontSize: 16, color: '#6c7062', maxWidth: 420, margin: '0 auto 26px', lineHeight: 1.55 }}>
                        {isOk
                            ? 'Tu pedido fue confirmado y ya lo estamos preparando. Te enviamos la confirmación a tu email.'
                            : <>El pago fue rechazado y <b style={{ color: '#22261d' }}>no se realizó ningún cargo</b>. Tus productos siguen guardados en el carrito; podés intentarlo de nuevo.</>
                        }
                    </p>

                    {/* Order info box */}
                    <div style={{ background: '#f6f4ec', border: '1px solid rgba(34,38,29,.10)', borderRadius: 14, padding: '4px 20px 10px', textAlign: 'left', marginBottom: 24 }}>
                        {paymentId && <InfoRow label={isOk ? 'ID de pago' : 'ID de operación'} value={paymentId} />}
                        {!isOk && <InfoRow label="Estado" value="Rechazado" valueStyle={{ color: '#c0392b' }} />}
                        {isOk && user?.email && <InfoRow label="Email de confirmación" value={user.email} truncate />}
                        {isOk && (
                            <InfoRow
                                label="Total abonado"
                                value={fmt(totalPrice || Number(sessionStorage.getItem('checkoutTotal') ?? 0))}
                                valueStyle={{ fontFamily: serif, fontWeight: 400, fontSize: 20 }}
                            />
                        )}
                    </div>

                    {/* Timeline (success/pending only) */}
                    {isOk && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, margin: '6px 0 28px' }}>
                            <TimelineStep isFirst done label="Confirmado" sub="Hoy" icon={
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                            } />
                            <TimelineStep done={false} label="En preparación" sub="24–48hs" icon={
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                            } />
                            <TimelineStep done={false} label="Enviado" sub="3–7 días" icon={
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/></svg>
                            } />
                        </div>
                    )}

                    {/* Error reasons (failure only) */}
                    {!isOk && (
                        <div style={{ textAlign: 'left', background: '#f6f4ec', border: '1px solid rgba(34,38,29,.10)', borderRadius: 14, padding: '16px 20px', marginBottom: 24 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.3px', marginBottom: 10, color: '#22261d' }}>¿Por qué pudo pasar?</p>
                            {[
                                'Fondos insuficientes o límite de la tarjeta superado.',
                                'Datos de la tarjeta mal ingresados.',
                                'El banco rechazó la operación — probá con otro medio de pago.',
                            ].map((r, i) => (
                                <div key={i} style={{ display: 'flex', gap: 9, fontSize: '13.5px', color: '#3f443a', lineHeight: 1.5, marginBottom: i < 2 ? 7 : 0 }}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c06a34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 3 }}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
                                    {r}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* CTA buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {isOk ? (
                            <Link to="/pedidos" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, height: 54, borderRadius: 13, background: '#566a2f', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', boxShadow: '0 8px 22px rgba(86,106,47,.28)', cursor: 'pointer', fontFamily: "'Karla', sans-serif" }}
                                onMouseEnter={e => e.currentTarget.style.background = '#465824'}
                                onMouseLeave={e => e.currentTarget.style.background = '#566a2f'}
                            >
                                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                                Ver mis pedidos
                            </Link>
                        ) : (
                            <button
                                onClick={() => navigate(-1)}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, height: 54, borderRadius: 13, background: '#c06a34', color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', boxShadow: '0 8px 22px rgba(192,106,52,.28)', cursor: 'pointer', width: '100%', fontFamily: "'Karla', sans-serif" }}
                                onMouseEnter={e => e.currentTarget.style.background = '#ab5b2a'}
                                onMouseLeave={e => e.currentTarget.style.background = '#c06a34'}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>
                                Reintentar pago
                            </button>
                        )}

                        {isOk ? (
                            <Link to="/tienda"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 46, borderRadius: 10, background: 'none', border: 'none', color: '#566a2f', fontWeight: 700, fontSize: '14.5px', cursor: 'pointer', fontFamily: "'Karla', sans-serif" }}
                                onMouseEnter={e => e.currentTarget.style.background = '#eef0e3'}
                                onMouseLeave={e => e.currentTarget.style.background = 'none'}
                            >
                                Seguir comprando
                            </Link>
                        ) : (
                            <button
                                onClick={() => { navigate('/tienda'); openCart(); }}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 46, borderRadius: 10, background: 'none', border: 'none', color: '#566a2f', fontWeight: 700, fontSize: '14.5px', cursor: 'pointer', width: '100%', fontFamily: "'Karla', sans-serif" }}
                                onMouseEnter={e => e.currentTarget.style.background = '#eef0e3'}
                                onMouseLeave={e => e.currentTarget.style.background = 'none'}
                            >
                                Volver al carrito
                            </button>
                        )}
                    </div>

                    {/* Help note */}
                    <p style={{ fontSize: '12.5px', color: '#6c7062', marginTop: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-9 8.4 9.5 9.5 0 0 1-4-1L3 20l1.1-4.9A8.38 8.38 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z"/></svg>
                        {isOk ? '¿Dudas con tu pedido?' : '¿Necesitás ayuda?'}{' '}
                        <a href="mailto:aconcaguamates1@gmail.com" style={{ color: '#566a2f', fontWeight: 700 }}>Escribinos</a>
                    </p>
                </div>
            </div>

            <style>{`
                @media(max-width:560px){
                    .ma-result-inner { padding: 34px 24px 30px !important; }
                }
            `}</style>
        </div>
    );
}
