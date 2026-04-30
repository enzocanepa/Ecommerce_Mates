import { useState, useEffect } from 'react';
import { projectId } from '/utils/supabase/info';
import { useAuth } from '../../context/AuthContext';
import type { Order } from '../../types';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-a8bad502`;
const LOCAL_ORDERS_KEY = 'mate_local_orders';

const STATUS: Record<string, { text: string; cls: string }> = {
  completed: { text: 'Completado', cls: 'bg-green-100 text-green-700' },
  pending:   { text: 'Pendiente',  cls: 'bg-yellow-100 text-yellow-700' },
  cancelled: { text: 'Cancelado',  cls: 'bg-red-100 text-red-700' },
};

export function AdminOrders() {
  const { accessToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      // Try Edge Function (real Supabase auth)
      if (accessToken) {
        try {
          const res = await fetch(`${BASE_URL}/admin/orders`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (res.ok) {
            const data = await res.json();
            setOrders(data.orders ?? []);
            setLoading(false);
            return;
          }
        } catch { /* fall through */ }
      }

      // Local fallback: read from localStorage
      try {
        const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
        setOrders(raw ? JSON.parse(raw) : []);
      } catch {
        setOrders([]);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [accessToken]);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Pedidos</h1>
        <p className="text-gray-500 text-sm mt-1">Historial de órdenes de todos los usuarios</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#a8c95f] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">ID Pedido</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Usuario</th>
                <th className="text-left px-6 py-3 text-gray-500 font-medium">Fecha</th>
                <th className="text-right px-6 py-3 text-gray-500 font-medium">Total</th>
                <th className="text-center px-6 py-3 text-gray-500 font-medium">Estado</th>
                <th className="text-right px-6 py-3 text-gray-500 font-medium">Ítems</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => {
                const status = STATUS[order.status] ?? { text: order.status, cls: 'bg-gray-100 text-gray-600' };
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">
                      {(order as any).userEmail
                        ? (order as any).userEmail
                        : order.userId
                        ? `${order.userId.slice(0, 8)}...`
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('es-AR', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-800">
                      ${order.total.toLocaleString('es-AR')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.cls}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">
                      {order.items.length}
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
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
