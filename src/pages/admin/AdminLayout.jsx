import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Store, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const serif = "'DM Serif Display', Georgia, serif";

const navItems = [
    { to: '/admin',           label: 'Dashboard', icon: LayoutDashboard, end: true  },
    { to: '/admin/productos', label: 'Productos', icon: Package,          end: false },
    { to: '/admin/pedidos',   label: 'Pedidos',   icon: ShoppingBag,      end: false },
];

export function AdminLayout() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sideOpen, setSideOpen] = useState(false);

    // Cierra el sidebar al navegar en mobile
    useEffect(() => { setSideOpen(false); }, [location.pathname]);

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const initial = (user?.name || user?.email || 'A')[0].toUpperCase();

    const SidebarContent = () => (
        <>
            {/* Brand */}
            <div style={{ padding: '22px 16px', borderBottom: '1px solid rgba(255,255,255,.10)', marginBottom: 18 }}>
                <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(238,240,227,.55)' }}>
                    Panel Admin
                </p>
                <div className="flex items-center gap-3" style={{ marginTop: 11 }}>
                    <div
                        className="flex-shrink-0 flex items-center justify-center rounded-full"
                        style={{ width: 40, height: 40, background: 'rgba(238,240,227,.16)', fontFamily: serif, fontSize: 19, color: '#eef0e3', boxShadow: 'inset 0 0 0 2px rgba(238,240,227,.35)' }}
                    >
                        {initial}
                    </div>
                    <div>
                        <b style={{ fontFamily: serif, fontSize: 20, fontWeight: 400, lineHeight: 1, display: 'block', color: '#eef0e3' }}>
                            {user?.name || 'Admin'}
                        </b>
                        <span style={{ fontSize: 11.5, color: 'rgba(238,240,227,.6)', marginTop: 3, display: 'block' }}>
                            Administrador
                        </span>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-1 flex-1" style={{ padding: '0 16px' }}>
                {navItems.map(({ to, label, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        style={({ isActive }) => ({
                            display: 'flex', alignItems: 'center', gap: 13,
                            padding: '12px 14px', borderRadius: 12,
                            fontSize: 15, fontWeight: 600,
                            color: isActive ? '#fff' : 'rgba(238,240,227,.82)',
                            background: isActive ? 'rgba(255,255,255,.14)' : 'transparent',
                            boxShadow: isActive ? 'inset 0 0 0 1px rgba(255,255,255,.12)' : 'none',
                            textDecoration: 'none', transition: 'background .18s, color .18s',
                        })}
                        onMouseEnter={e => { e.currentTarget.style.background = e.currentTarget.getAttribute('aria-current') ? 'rgba(255,255,255,.14)' : 'rgba(255,255,255,.07)'; }}
                        onMouseLeave={e => { if (!e.currentTarget.getAttribute('aria-current')) e.currentTarget.style.background = 'transparent'; }}
                    >
                        <Icon size={20} style={{ flexShrink: 0, opacity: .92 }} />
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div style={{ padding: '18px 16px 22px', borderTop: '1px solid rgba(255,255,255,.10)', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <NavLink
                    to="/"
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: 'rgba(238,240,227,.72)', textDecoration: 'none', transition: 'background .18s, color .18s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(238,240,227,.72)'; }}
                >
                    <Store size={18} />
                    Ver tienda
                </NavLink>
                <button
                    onClick={handleSignOut}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 10, fontSize: 14, fontWeight: 600, color: 'rgba(238,240,227,.72)', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'background .18s, color .18s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,.07)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(238,240,227,.72)'; }}
                >
                    <LogOut size={18} />
                    Cerrar sesión
                </button>
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen" style={{ background: '#f1efe6' }}>

            {/* Sidebar — desktop (sticky) */}
            <aside
                className="hidden md:flex flex-col flex-shrink-0 sticky top-0 h-screen"
                style={{ width: 248, background: 'linear-gradient(180deg,#41501f,#3a4a1f)', color: '#eef0e3' }}
            >
                <SidebarContent />
            </aside>

            {/* Sidebar — mobile (fixed drawer) */}
            <>
                {/* Backdrop */}
                {sideOpen && (
                    <div
                        className="md:hidden fixed inset-0 z-40"
                        style={{ background: 'rgba(34,38,29,.5)', backdropFilter: 'blur(2px)' }}
                        onClick={() => setSideOpen(false)}
                    />
                )}
                {/* Drawer */}
                <aside
                    className="md:hidden fixed top-0 left-0 h-full z-50 flex flex-col"
                    style={{
                        width: 248,
                        background: 'linear-gradient(180deg,#41501f,#3a4a1f)',
                        color: '#eef0e3',
                        transform: sideOpen ? 'translateX(0)' : 'translateX(-100%)',
                        transition: 'transform .3s cubic-bezier(.4,0,.2,1)',
                        boxShadow: sideOpen ? '4px 0 24px rgba(34,38,29,.3)' : 'none',
                    }}
                >
                    {/* Close button inside drawer */}
                    <button
                        onClick={() => setSideOpen(false)}
                        className="absolute top-4 right-4"
                        style={{ background: 'rgba(238,240,227,.12)', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'grid', placeItems: 'center', cursor: 'pointer', color: '#eef0e3' }}
                    >
                        <X size={16} />
                    </button>
                    <SidebarContent />
                </aside>
            </>

            {/* Main */}
            <main className="flex-1 min-w-0 overflow-auto">
                {/* Mobile top bar */}
                <div
                    className="md:hidden flex items-center gap-3 sticky top-0 z-30"
                    style={{ background: 'linear-gradient(135deg,#41501f,#3a4a1f)', padding: '13px 16px' }}
                >
                    <button
                        onClick={() => setSideOpen(true)}
                        style={{ background: 'rgba(238,240,227,.15)', border: '1px solid rgba(238,240,227,.2)', borderRadius: 10, width: 40, height: 40, display: 'grid', placeItems: 'center', cursor: 'pointer', color: '#eef0e3', flexShrink: 0 }}
                    >
                        <Menu size={20} />
                    </button>
                    <span style={{ fontFamily: serif, fontSize: 20, color: '#eef0e3', fontWeight: 400, letterSpacing: '-.2px' }}>Panel Admin</span>
                </div>

                <Outlet />
            </main>
        </div>
    );
}
