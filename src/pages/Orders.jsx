import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router';
import { getBaseUrl } from '../services/api';
import { Package, ShoppingBag, Check, ArrowRight } from 'lucide-react';

const BASE_URL = getBaseUrl();
const serif = "'DM Serif Display', Georgia, serif";

const STATUS_META = {
    pending:   { label: 'En preparación', bg: '#fbf1dd', color: '#9a6b16', dot: '#d9a23a' },
    completed: { label: 'Entregado',      bg: '#eef0e3', color: '#465824', dot: '#566a2f' },
    cancelled: { label: 'Cancelado',      bg: '#fde8e8', color: '#c53030', dot: '#e53e3e' },
};

const PROGRESS_STEPS = ['Confirmado', 'En preparación', 'Enviado', 'Entregado'];

function getProgressIndex(status) {
    if (status === 'completed') return 4;
    if (status === 'pending')   return 1;
    return -1;
}

function StatusBadge({ status }) {
    const m = STATUS_META[status] ?? { label: status, bg: '#e7e4d6', color: '#6c7062', dot: '#9a9d90' };
    return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 700, padding: '7px 14px', borderRadius: 999, background: m.bg, color: m.color, whiteSpace: 'nowrap' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: m.dot, flexShrink: 0 }} />
            {m.label}
        </span>
    );
}

function ProgressTracker({ status }) {
    if (status === 'cancelled') return null;
    const current = getProgressIndex(status);
    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', padding: '18px 24px 4px', gap: 0 }}>
            {PROGRESS_STEPS.map((step, i) => {
                const done = i < current;
                const now  = i === current;
                return (
                    <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative' }}>
                        {/* Connecting line */}
                        {i > 0 && (
                            <div style={{ position: 'absolute', top: 13, left: '-50%', width: '100%', height: 2, background: done ? '#566a2f' : '#e0ddcf', zIndex: 0 }} />
                        )}
                        {/* Node */}
                        <span style={{
                            width: 26, height: 26, borderRadius: '50%', display: 'grid', placeItems: 'center', zIndex: 1, flexShrink: 0,
                            background: done ? '#566a2f' : now ? '#c06a34' : '#e7e4d6',
                            color: done || now ? '#fff' : '#6c7062',
                            boxShadow: now ? '0 0 0 4px rgba(192,106,52,.16)' : 'none',
                        }}>
                            {done ? <Check size={13} strokeWidth={3} /> : <span style={{ fontSize: 11, fontWeight: 700 }}>{i + 1}</span>}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: done || now ? '#22261d' : '#6c7062', whiteSpace: 'nowrap', textAlign: 'center' }}>
                            {step}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

export function Orders() {
    const { user, accessToken } = useAuth();
    const [orders, setOrders]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab]         = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        (async () => {
            try {
                const res = await fetch(`${BASE_URL}/api/orders`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (res.ok) { const d = await res.json(); setOrders(d.orders ?? []); }
            } catch { setOrders([]); }
            finally  { setLoading(false); }
        })();
    }, [user, accessToken, navigate]);

    const fmt = n => '$' + Number(n).toLocaleString('es-AR');

    const TABS = [
        { id: 'all',       label: 'Todos',      filter: () => true },
        { id: 'active',    label: 'En curso',   filter: o => o.status === 'pending' },
        { id: 'delivered', label: 'Entregados', filter: o => o.status === 'completed' },
        { id: 'cancelled', label: 'Cancelados', filter: o => o.status === 'cancelled' },
    ];

    const visible = orders.filter(TABS.find(t => t.id === tab)?.filter ?? (() => true));

    if (loading) {
        return (
            <div style={{ background: '#f6f4ec', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 36, height: 36, border: '3px solid #eef0e3', borderTopColor: '#566a2f', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
        );
    }

    return (
        <div style={{ background: '#f6f4ec', minHeight: '100vh', paddingBottom: 80 }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px' }}>

                {/* Page header */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', padding: '46px 0 8px' }}>
                    <div>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontSize: '12.5px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#c06a34', marginBottom: 12 }}>
                            <span style={{ width: 26, height: 1.5, background: '#c06a34', display: 'inline-block' }} />
                            Mi cuenta
                        </span>
                        <h1 style={{ fontFamily: serif, fontSize: 'clamp(32px,5vw,42px)', letterSpacing: '-.4px', color: '#22261d' }}>Mis pedidos</h1>
                        <p style={{ fontSize: '15.5px', color: '#6c7062', marginTop: 4 }}>Seguí el estado de tus compras.</p>
                    </div>
                    <Link
                        to="/tienda"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 42, padding: '0 18px', borderRadius: 999, border: '1px solid rgba(34,38,29,.18)', background: '#fff', color: '#22261d', fontWeight: 700, fontSize: '14.5px', flexShrink: 0 }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#566a2f'; e.currentTarget.style.color = '#566a2f'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(34,38,29,.18)'; e.currentTarget.style.color = '#22261d'; }}
                    >
                        Seguir comprando <ArrowRight size={17} />
                    </Link>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 0, flexWrap: 'nowrap', overflowX: 'auto', margin: '26px 0 24px', borderBottom: '1px solid rgba(34,38,29,.10)', scrollbarWidth: 'none' }}>
                    {TABS.map(t => {
                        const count = orders.filter(t.filter).length;
                        if (t.id !== 'all' && count === 0) return null;
                        const active = tab === t.id;
                        return (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                style={{
                                    position: 'relative', padding: '10px 4px', marginRight: 18,
                                    fontSize: '14.5px', fontWeight: 700, cursor: 'pointer',
                                    background: 'none', border: 'none', fontFamily: "'Karla', sans-serif",
                                    color: active ? '#566a2f' : '#6c7062',
                                    borderBottom: active ? '2px solid #566a2f' : '2px solid transparent',
                                    marginBottom: -1, transition: 'color .2s',
                                    flexShrink: 0, whiteSpace: 'nowrap',
                                }}
                            >
                                {t.label}
                                <span style={{ fontSize: '11.5px', fontWeight: 700, background: active ? '#eef0e3' : '#e7e4d6', color: active ? '#566a2f' : '#6c7062', borderRadius: 999, padding: '1px 8px', marginLeft: 6 }}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Empty state */}
                {visible.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                        <div style={{ width: 88, height: 88, borderRadius: 26, background: '#eef0e3', color: '#566a2f', display: 'grid', placeItems: 'center', margin: '0 auto 18px' }}>
                            <ShoppingBag size={42} strokeWidth={1.6} />
                        </div>
                        <h3 style={{ fontFamily: serif, fontSize: 26, marginBottom: 8 }}>Todavía no tenés pedidos</h3>
                        <p style={{ fontSize: 15, color: '#6c7062', maxWidth: 300, margin: '0 auto 18px' }}>
                            Cuando hagas tu primera compra vas a poder seguirla desde acá.
                        </p>
                        <Link
                            to="/tienda"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, height: 44, padding: '0 22px', borderRadius: 999, background: '#566a2f', color: '#f5f2e6', fontWeight: 700, fontSize: 15 }}
                        >
                            Ir a la tienda
                        </Link>
                    </div>
                )}

                {/* Orders list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {visible.map(order => (
                        <div key={order.id} style={{ background: '#fff', border: '1px solid rgba(34,38,29,.10)', borderRadius: 20, boxShadow: '0 1px 2px rgba(34,38,29,.06),0 6px 16px rgba(34,38,29,.05)', overflow: 'hidden' }}>

                            {/* Head */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '20px 24px', borderBottom: '1px solid rgba(34,38,29,.10)', flexWrap: 'wrap' }}>
                                <span style={{ width: 42, height: 42, borderRadius: 11, background: '#eef0e3', color: '#566a2f', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                                    <Package size={20} strokeWidth={1.9} />
                                </span>
                                <div style={{ marginRight: 'auto' }}>
                                    <h3 style={{ fontFamily: serif, fontSize: 19, lineHeight: 1.1 }}>
                                        Pedido #{order.id.slice(0, 8).toUpperCase()}
                                    </h3>
                                    <div style={{ fontSize: 13, color: '#6c7062', marginTop: 2 }}>
                                        {new Date(order.createdAt).toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        {' · '}
                                        {new Date(order.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs
                                    </div>
                                </div>
                                <StatusBadge status={order.status} />
                            </div>

                            {/* Progress */}
                            <ProgressTracker status={order.status} />

                            {/* Items */}
                            <div style={{ padding: '8px 24px' }}>
                                {order.items.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < order.items.length - 1 ? '1px solid rgba(34,38,29,.08)' : 'none' }}>
                                        <div style={{ width: 56, height: 56, borderRadius: 11, overflow: 'hidden', background: '#eceadf', flexShrink: 0, border: '1px solid rgba(34,38,29,.08)' }}>
                                            {item.product?.image && (
                                                <img src={item.product.image} alt={item.product?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                                            )}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.25, color: '#22261d' }}>
                                                {item.product?.name ?? 'Producto'}
                                            </div>
                                            <div style={{ fontSize: '12.5px', color: '#6c7062', marginTop: 2 }}>
                                                {[item.product?.category, `Cantidad: ${item.quantity}`].filter(Boolean).join(' · ')}
                                            </div>
                                        </div>
                                        <div style={{ fontFamily: "'Karla', sans-serif", fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap', color: '#22261d' }}>
                                            {fmt((item.unitPrice ?? item.price ?? 0) * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '18px 24px', background: '#fbfaf4', borderTop: '1px solid rgba(34,38,29,.10)', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '14.5px', color: '#6c7062' }}>
                                    Total
                                    <b style={{ fontFamily: "'Karla', sans-serif", fontWeight: 700, fontSize: 22, color: '#22261d', marginLeft: 8 }}>
                                        {fmt(order.total)}
                                    </b>
                                </span>
                                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                    {order.status === 'cancelled' && (
                                        <Link
                                            to="/tienda"
                                            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 40, padding: '0 16px', borderRadius: 999, background: '#566a2f', color: '#f5f2e6', fontWeight: 700, fontSize: '13.5px', fontFamily: "'Karla', sans-serif" }}
                                        >
                                            Ir a la tienda
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @media (max-width: 560px) {
                    .orders-head { flex-direction: column; align-items: flex-start !important; }
                }
            `}</style>
        </div>
    );
}
