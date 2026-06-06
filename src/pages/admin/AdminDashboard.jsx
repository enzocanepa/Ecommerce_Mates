import { useState, useEffect } from 'react';
import { Package, Layers, DollarSign, ShoppingBag } from 'lucide-react';
import { useProducts } from '../../context/ProductsContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';

const serif = "'DM Serif Display', Georgia, serif";

const STAT_STYLES = [
    { bg: '#e6efe0', color: '#566a2f' },
    { bg: '#e4ecf4', color: '#3f6f96' },
    { bg: '#f7eed6', color: '#b07d1e' },
    { bg: '#efe6f1', color: '#7a5288' },
];

const ORDER_STATUS = {
    pending:   { text: 'Pendiente',      dot: '#d9a23a', bg: '#f7eed6', color: '#9a6b16' },
    completed: { text: 'Completado',     dot: '#5b9c4e', bg: '#e6efe0', color: '#3f7a3a' },
    cancelled: { text: 'Cancelado',      dot: '#c0392b', bg: '#fbe7e0', color: '#a52f23' },
    shipped:   { text: 'Enviado',        dot: '#3b82bc', bg: '#e4ecf4', color: '#2b6087' },
    preparing: { text: 'En preparación', dot: '#3b82bc', bg: '#e4ecf4', color: '#2b6087' },
};

function StockPill({ stock }) {
    if (stock <= 10)  return <span style={{ background: '#fbe7e0', color: '#b1492a', fontSize: 12.5, fontWeight: 700, padding: '4px 11px', borderRadius: 999 }}>{stock} u.</span>;
    if (stock <= 20) return <span style={{ background: '#f7eed6', color: '#a5781f', fontSize: 12.5, fontWeight: 700, padding: '4px 11px', borderRadius: 999 }}>{stock} u.</span>;
    return <span style={{ background: '#e6efe0', color: '#566a2f', fontSize: 12.5, fontWeight: 700, padding: '4px 11px', borderRadius: 999 }}>{stock} u.</span>;
}

export function AdminDashboard() {
    const { products } = useProducts();
    const { accessToken } = useAuth();
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        if (!accessToken) return;
        orderService.getAllOrders(accessToken)
            .then(data => setRecentOrders((data.orders ?? []).slice(0, 3)))
            .catch(() => {});
    }, [accessToken]);

    const totalStock = products.reduce((acc, p) => acc + (p.stock ?? 0), 0);
    const totalValue = products.reduce((acc, p) => acc + p.price * (p.stock ?? 0), 0);
    const byCategory = products.reduce((acc, p) => {
        const key = p.category ?? 'Sin categoría';
        acc[key] = (acc[key] ?? 0) + 1;
        return acc;
    }, {});

    const lowStock = [...products]
        .filter(p => (p.stock ?? 0) <= 20)
        .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
        .slice(0, 5);

    const stats = [
        { label: 'Productos activos',    value: products.length,                              icon: Package,    style: STAT_STYLES[0] },
        { label: 'Stock total',          value: totalStock,                                   icon: Layers,     style: STAT_STYLES[1] },
        { label: 'Valor del inventario', value: `$${totalValue.toLocaleString('es-AR')}`,     icon: DollarSign, style: STAT_STYLES[2] },
        { label: 'Categorías',           value: Object.keys(byCategory).length,               icon: ShoppingBag,style: STAT_STYLES[3] },
    ];

    return (
        <div className="px-4 py-6 md:px-11 md:py-[38px]" style={{ paddingBottom: 60 }}>
            <div style={{ marginBottom: 30 }}>
                <h1 style={{ fontFamily: serif, fontSize: 36, letterSpacing: '-.3px', lineHeight: 1.05, color: '#22261d' }}>Dashboard</h1>
                <p style={{ fontSize: 15, color: '#7a7d70', marginTop: 5 }}>Resumen general del negocio</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5" style={{ marginBottom: 24 }}>
                {stats.map(({ label, value, icon: Icon, style }) => (
                    <div
                        key={label}
                        className="flex items-center gap-4"
                        style={{ background: '#fff', border: '1px solid rgba(34,38,29,.10)', borderRadius: 18, padding: 22, boxShadow: '0 1px 2px rgba(34,38,29,.05),0 4px 14px rgba(34,38,29,.05)' }}
                    >
                        <div style={{ width: 50, height: 50, borderRadius: 14, background: style.bg, color: style.color, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                            <Icon size={22} />
                        </div>
                        <div>
                            <div style={{ fontFamily: serif, fontSize: 30, lineHeight: 1, letterSpacing: '-.5px', color: '#22261d' }}>{value}</div>
                            <div style={{ fontSize: 13.5, color: '#7a7d70', marginTop: 6, fontWeight: 600 }}>{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Category bars */}
            <div style={{ background: '#fff', border: '1px solid rgba(34,38,29,.10)', borderRadius: 18, boxShadow: '0 1px 2px rgba(34,38,29,.05),0 4px 14px rgba(34,38,29,.05)', marginBottom: 24 }}>
                <div className="flex items-center justify-between" style={{ padding: '22px 24px 6px' }}>
                    <h2 style={{ fontFamily: serif, fontSize: 21, color: '#22261d' }}>Productos por categoría</h2>
                    <span style={{ fontSize: 13, color: '#7a7d70' }}>{products.length} productos en total</span>
                </div>
                <div style={{ padding: '14px 24px 24px' }}>
                    {Object.keys(byCategory).length === 0 ? (
                        <p style={{ fontSize: 14, color: '#9a9d90', textAlign: 'center', padding: '16px 0' }}>Sin datos</p>
                    ) : Object.entries(byCategory).map(([cat, count]) => {
                        const pct = products.length > 0 ? Math.round((count / products.length) * 100) : 0;
                        return (
                            <div key={cat} style={{ padding: '14px 0', borderBottom: '1px solid rgba(34,38,29,.10)' }} className="last:border-b-0">
                                <div className="flex justify-between items-baseline" style={{ marginBottom: 9 }}>
                                    <span style={{ fontSize: 15, fontWeight: 700, color: '#22261d', textTransform: 'capitalize' }}>{cat}</span>
                                    <span style={{ fontSize: 13, color: '#7a7d70', fontWeight: 600 }}>{count} producto{count !== 1 ? 's' : ''} · {pct}%</span>
                                </div>
                                <div style={{ height: 9, borderRadius: 6, background: '#ecebe0', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', borderRadius: 6, background: 'linear-gradient(90deg,#566a2f,#7fa348)', width: `${pct}%`, transition: 'width .6s ease' }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Two-column panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* Low stock */}
                <div style={{ background: '#fff', border: '1px solid rgba(34,38,29,.10)', borderRadius: 18, boxShadow: '0 1px 2px rgba(34,38,29,.05),0 4px 14px rgba(34,38,29,.05)' }}>
                    <div className="flex items-center justify-between" style={{ padding: '22px 24px 6px' }}>
                        <h2 style={{ fontFamily: serif, fontSize: 21, color: '#22261d' }}>Stock bajo</h2>
                        <span style={{ fontSize: 13, color: '#7a7d70' }}>Revisá y reponé</span>
                    </div>
                    <div style={{ paddingBottom: 8 }}>
                        {lowStock.length === 0 ? (
                            <p style={{ fontSize: 14, color: '#9a9d90', textAlign: 'center', padding: '24px 0' }}>Todo el stock está en buen nivel</p>
                        ) : lowStock.map(p => (
                            <div key={p.id} className="flex items-center gap-3" style={{ padding: '13px 24px', borderBottom: '1px solid rgba(34,38,29,.08)' }}>
                                <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', background: '#eceadf', flexShrink: 0, border: '1px solid rgba(34,38,29,.10)' }}>
                                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 14.5, fontWeight: 700, color: '#22261d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#7a7d70', textTransform: 'capitalize' }}>{p.category}</div>
                                </div>
                                <StockPill stock={p.stock ?? 0} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent orders */}
                <div style={{ background: '#fff', border: '1px solid rgba(34,38,29,.10)', borderRadius: 18, boxShadow: '0 1px 2px rgba(34,38,29,.05),0 4px 14px rgba(34,38,29,.05)' }}>
                    <div className="flex items-center justify-between" style={{ padding: '22px 24px 6px' }}>
                        <h2 style={{ fontFamily: serif, fontSize: 21, color: '#22261d' }}>Pedidos recientes</h2>
                        <span style={{ fontSize: 13, color: '#7a7d70' }}>Últimos {recentOrders.length}</span>
                    </div>
                    <div style={{ paddingBottom: 8 }}>
                        {recentOrders.length === 0 ? (
                            <p style={{ fontSize: 14, color: '#9a9d90', textAlign: 'center', padding: '24px 0' }}>No hay pedidos aún</p>
                        ) : recentOrders.map(order => {
                            const st = ORDER_STATUS[order.status] ?? { text: order.status, dot: '#9a9d90', bg: '#f0efe8', color: '#6c7062' };
                            const date = new Date(order.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
                            return (
                                <div key={order.id} className="flex items-center gap-3" style={{ padding: '13px 24px', borderBottom: '1px solid rgba(34,38,29,.08)' }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 14.5, fontWeight: 700, color: '#22261d' }}>
                                            Pedido #{order.id.slice(0, 8).toUpperCase()}
                                        </div>
                                        <div style={{ fontSize: 12.5, fontWeight: 600, color: '#7a7d70' }}>
                                            {date} · {order.user?.email ?? '—'}
                                        </div>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5" style={{ fontSize: 12.5, fontWeight: 700, padding: '5px 12px', borderRadius: 999, background: st.bg, color: st.color, whiteSpace: 'nowrap' }}>
                                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: st.dot, flexShrink: 0 }} />
                                        {st.text}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
