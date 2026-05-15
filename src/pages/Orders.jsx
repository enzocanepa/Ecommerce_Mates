import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router';
import { getBaseUrl } from '../services/api';
import { Package, ShoppingBag } from 'lucide-react';
const BASE_URL = getBaseUrl();
const STATUS_LABEL = {
    completed: 'Completado',
    pending: 'Pendiente',
    cancelled: 'Cancelado',
};
export function Orders() {
    const { user, accessToken } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${BASE_URL}/orders`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data.orders ?? []);
                }
            } catch {
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user, accessToken, navigate]);
    if (loading) {
        return (<div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#a8c95f] border-t-transparent rounded-full animate-spin"/>
      </div>);
    }
    if (orders.length === 0) {
        return (<div className="py-20 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6"/>
          <h2 className="text-3xl mb-4">No tenés pedidos aún</h2>
          <p className="text-gray-600 mb-8">
            ¡Realizá tu primera compra y empezá a disfrutar de nuestros productos!
          </p>
          <Link to="/tienda" className="inline-block bg-[#c7e47d] text-[#4a5f2f] px-8 py-3 rounded-lg hover:bg-[#b8d66e] transition-colors">
            Ir a la Tienda
          </Link>
        </div>
      </div>);
    }
    return (<div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8">Mis Pedidos</h1>

        <div className="space-y-5">
          {orders.map((order) => (<div key={order.id} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-[#a8c95f]"/>
                    <h3 className="font-semibold text-gray-800">
                      Pedido #{order.id.slice(0, 8).toUpperCase()}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('es-AR', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
            })}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'completed'
                ? 'bg-green-100 text-green-700'
                : order.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'}`}>
                  {STATUS_LABEL[order.status] ?? order.status}
                </span>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                {order.items.map((item, i) => (<div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
                    <span className="font-medium text-gray-800">
                      ${(item.price * item.quantity).toLocaleString('es-AR')}
                    </span>
                  </div>))}
              </div>

              <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-xl font-bold text-[#4a5f2f]">
                  ${order.total.toLocaleString('es-AR')}
                </span>
              </div>
            </div>))}
        </div>
      </div>
    </div>);
}
