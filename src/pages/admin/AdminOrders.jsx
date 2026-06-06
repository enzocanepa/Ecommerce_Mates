import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { toast } from 'sonner';

const serif = "'DM Serif Display', Georgia, serif";

const STATUS_OPTIONS = [
    { value: 'pending',   label: 'Pendiente',        dot: '#d9a23a', bg: '#f7eed6', color: '#9a6b16' },
    { value: 'preparing', label: 'En preparación',   dot: '#3b82bc', bg: '#e4ecf4', color: '#2b6087' },
    { value: 'shipped',   label: 'Enviado',           dot: '#5b9c4e', bg: '#e6efe0', color: '#3f7a3a' },
    { value: 'completed', label: 'Entregado',         dot: '#566a2f', bg: '#e6efe0', color: '#465824' },
    { value: 'cancelled', label: 'Cancelado',         dot: '#c0392b', bg: '#fbe7e0', color: '#b1492a' },
];

function statusInfo(value) {
    return STATUS_OPTIONS.find(s => s.value === value) ?? { label: value, dot: '#9a9d90', bg: '#f0efe8', color: '#6c7062' };
}

function StatusPill({ status }) {
    const s = statusInfo(status);
    return (
        <span className="inline-flex items-center gap-1.5" style={{ fontSize: 12.5, fontWeight: 700, padding: '5px 12px', borderRadius: 999, background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
            {s.label}
        </span>
    );
}

export function AdminOrders() {
    const { accessToken } = useAuth();
    const [orders,  setOrders]  = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState('');
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        if (!accessToken) return;
        orderService.getAllOrders(accessToken)
            .then(data => setOrders(data.orders ?? []))
            .catch(() => setError('No se pudieron cargar los pedidos.'))
            .finally(() => setLoading(false));
    }, [accessToken]);

    async function handleStatusChange(orderId, newStatus) {
        setUpdating(orderId);
        try {
            await orderService.updateOrderStatus(orderId, newStatus, accessToken);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            toast.success('Estado actualizado.');
        } catch {
            toast.error('No se pudo actualizar el estado.');
        } finally {
            setUpdating(null);
        }
    }

    return (
        <div style={{ padding: '38px 44px 60px' }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontFamily: serif, fontSize: 36, letterSpacing: '-.3px', lineHeight: 1.05, color: '#22261d' }}>Pedidos</h1>
                <p style={{ fontSize: 15, color: '#7a7d70', marginTop: 5 }}>Historial de órdenes de todos los usuarios</p>
            </div>

            {loading ? (
                <div className="flex justify-center" style={{ paddingTop: 80 }}>
                    <div style={{ width: 36, height: 36, border: '3px solid #e6efe0', borderTop: '3px solid #566a2f', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>
            ) : error ? (
                <div style={{ background: '#fbe7e0', border: '1px solid #f5c6bb', color: '#b1492a', padding: '12px 16px', borderRadius: 12, fontSize: 14 }}>{error}</div>
            ) : (
                <div style={{ background: '#fff', border: '1px solid rgba(34,38,29,.10)', borderRadius: 18, boxShadow: '0 1px 2px rgba(34,38,29,.05),0 4px 14px rgba(34,38,29,.05)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#faf9f3', borderBottom: '1px solid rgba(34,38,29,.10)' }}>
                                {['ID Pedido', 'Usuario', 'Fecha', 'Total', 'Estado', 'Ítems'].map((h, i) => (
                                    <th key={h} style={{
                                        textAlign: i === 3 ? 'right' : i === 5 ? 'right' : 'left',
                                        fontSize: 12, fontWeight: 700, letterSpacing: '.6px',
                                        textTransform: 'uppercase', color: '#7a7d70', padding: '16px 20px'
                                    }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id}
                                    style={{ borderBottom: '1px solid rgba(34,38,29,.08)', transition: 'background .15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#faf9f3'}
                                    onMouseLeave={e => e.currentTarget.style.background = ''}>
                                    <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}>
                                        <div style={{ fontWeight: 700, fontSize: 14.5, color: '#22261d', fontVariantNumeric: 'tabular-nums', letterSpacing: '.3px' }}>
                                            #{order.id.slice(0, 8).toUpperCase()}
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 20px', fontSize: 13.5, color: '#7a7d70', verticalAlign: 'middle', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {order.user?.email ?? order.user?.id?.slice(0, 8) ?? '—'}
                                    </td>
                                    <td style={{ padding: '14px 20px', fontSize: 13.5, color: '#7a7d70', verticalAlign: 'middle', fontVariantNumeric: 'tabular-nums' }}>
                                        {new Date(order.createdAt).toLocaleDateString('es-AR', {
                                            day: '2-digit', month: 'short', year: 'numeric',
                                            hour: '2-digit', minute: '2-digit',
                                        })}
                                    </td>
                                    <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 700, fontSize: 14.5, color: '#22261d', verticalAlign: 'middle', fontVariantNumeric: 'tabular-nums' }}>
                                        ${order.total.toLocaleString('es-AR')}
                                    </td>
                                    <td style={{ padding: '14px 20px', verticalAlign: 'middle' }}>
                                        {updating === order.id ? (
                                            <StatusPill status={order.status} />
                                        ) : (
                                            <select
                                                value={order.status}
                                                onChange={e => handleStatusChange(order.id, e.target.value)}
                                                style={{
                                                    fontFamily: "'Karla', sans-serif", fontSize: 12.5, fontWeight: 700,
                                                    border: '1px solid rgba(34,38,29,.12)', background: '#fff',
                                                    borderRadius: 999, padding: '5px 10px', color: '#22261d',
                                                    cursor: 'pointer', outline: 'none', transition: 'border-color .2s',
                                                }}
                                                onFocus={e => e.target.style.borderColor = '#566a2f'}
                                                onBlur={e => e.target.style.borderColor = 'rgba(34,38,29,.12)'}
                                            >
                                                {STATUS_OPTIONS.map(s => (
                                                    <option key={s.value} value={s.value}>{s.label}</option>
                                                ))}
                                            </select>
                                        )}
                                    </td>
                                    <td style={{ padding: '14px 20px', textAlign: 'right', fontSize: 14.5, color: '#22261d', fontWeight: 600, verticalAlign: 'middle', fontVariantNumeric: 'tabular-nums' }}>
                                        {order.items?.length ?? 0}
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ padding: '48px 20px', textAlign: 'center', color: '#9a9d90', fontSize: 14 }}>
                                        No hay pedidos registrados aún.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
