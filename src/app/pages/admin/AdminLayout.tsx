import { NavLink, Outlet, useNavigate } from 'react-router';
import { LayoutDashboard, Package, ShoppingBag, LogOut, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/productos', label: 'Productos', icon: Package, end: false },
  { to: '/admin/pedidos', label: 'Pedidos', icon: ShoppingBag, end: false },
];

export function AdminLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#4a5f2f] text-white flex flex-col shadow-xl flex-shrink-0">
        <div className="px-6 py-5 border-b border-white/10">
          <p className="text-xs uppercase tracking-widest text-white/50 mb-1">Panel Admin</p>
          <p className="font-semibold truncate">{user?.name || user?.email}</p>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                  isActive
                    ? 'bg-[#a8c95f] text-[#4a5f2f] font-semibold'
                    : 'text-white/80 hover:bg-white/10'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-6 space-y-1">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/80 hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
            Ver tienda
          </NavLink>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/80 hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
