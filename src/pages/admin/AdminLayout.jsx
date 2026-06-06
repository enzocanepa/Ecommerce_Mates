import { NavLink, Outlet, useNavigate } from 'react-router';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const serif = "'DM Serif Display', Georgia, serif";

const navItems = [
    { to: '/admin',           label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/productos', label: 'Productos', icon: Package,          end: false },
    { to: '/admin/pedidos',   label: 'Pedidos',   icon: ShoppingBag,      end: false },
];

export function AdminLayout() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const initial = (user?.name || user?.email || 'A')[0].toUpperCase();

    return (
        <div className="flex min-h-screen" style={{ background: '#f1efe6' }}>

            {/* Sidebar */}
            <aside
                className="w-[248px] flex-shrink-0 flex flex-col sticky top-0 h-screen"
                style={{ background: 'linear-gradient(180deg,#41501f,#3a4a1f)', color: '#eef0e3' }}
            >
                {/* Brand */}
                <div className="px-4 py-[22px]" style={{ borderBottom: '1px solid rgba(255,255,255,.10)', marginBottom: 18 }}>
                    <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(238,240,227,.55)' }}>
                        Panel Admin
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                        <div
                            className="flex-shrink-0 flex items-center justify-center rounded-full text-[#eef0e3]"
                            style={{ width: 40, height: 40, background: 'rgba(238,240,227,.16)', fontFamily: serif, fontSize: 19, boxShadow: 'inset 0 0 0 2px rgba(238,240,227,.35)' }}
                        >
                            {initial}
                        </div>
                        <div>
                            <b style={{ fontFamily: serif, fontSize: 20, fontWeight: 400, lineHeight: 1, display: 'block' }}>
                                {user?.name || 'Admin'}
                            </b>
                            <span style={{ fontSize: 11.5, color: 'rgba(238,240,227,.6)', marginTop: 3, display: 'block' }}>
                                Administrador
                            </span>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex flex-col gap-1 px-4 flex-1">
                    {navItems.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl text-[15px] font-semibold transition-all duration-150 active:translate-y-px ${
                                    isActive
                                        ? 'text-white'
                                        : 'text-[rgba(238,240,227,.82)] hover:text-white'
                                }`
                            }
                            style={({ isActive }) => ({
                                padding: '12px 14px',
                                background: isActive ? 'rgba(255,255,255,.14)' : 'transparent',
                                boxShadow: isActive ? 'inset 0 0 0 1px rgba(255,255,255,.12)' : 'none',
                            })}
                            onMouseEnter={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.background = 'rgba(255,255,255,.07)'; }}
                            onMouseLeave={e => { if (!e.currentTarget.getAttribute('aria-current')) e.currentTarget.style.background = ''; }}
                        >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="px-4 pb-6 flex flex-col gap-1" style={{ borderTop: '1px solid rgba(255,255,255,.10)', paddingTop: 18 }}>
                    <NavLink
                        to="/"
                        className="flex items-center gap-3 rounded-xl text-[14px] font-semibold transition-all duration-150"
                        style={{ padding: '11px 14px', color: 'rgba(238,240,227,.72)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(238,240,227,.72)'; }}
                    >
                        <Store className="w-[18px] h-[18px]" />
                        Ver tienda
                    </NavLink>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 rounded-xl text-[14px] font-semibold w-full text-left transition-all duration-150"
                        style={{ padding: '11px 14px', color: 'rgba(238,240,227,.72)', background: 'none', border: 'none', cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(238,240,227,.72)'; }}
                    >
                        <LogOut className="w-[18px] h-[18px]" />
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 min-w-0 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}
