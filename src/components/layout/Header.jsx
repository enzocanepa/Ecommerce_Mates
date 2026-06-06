import { Link, useLocation, useNavigate } from 'react-router';
import { Menu, User, X, LayoutDashboard, Package, LogOut, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { DesktopSearchBar, MobileSearchOverlay } from './SearchBar';
import { UserMenu } from './UserMenu';
import { CartButton } from './CartButton';

const serif = "'DM Serif Display', Georgia, serif";

export function Header() {
    const { totalItems } = useCart();
    const { user, signOut, isAdmin } = useAuth();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSearchOpen,   setIsSearchOpen]   = useState(false);
    const [searchValue,    setSearchValue]    = useState('');
    const [drawerOpen,     setDrawerOpen]     = useState(false);

    // Cierra drawer al navegar
    useEffect(() => { setDrawerOpen(false); }, [pathname]);

    const handleSignOut = async () => {
        await signOut();
        setIsUserMenuOpen(false);
        setDrawerOpen(false);
    };

    const navLink = (to, label) => {
        const active = pathname === to || (to !== '/' && pathname.startsWith(to));
        return (
            <Link
                to={to}
                className={`relative text-[15px] font-semibold px-0.5 py-1.5 transition-colors duration-200
                    ${active ? 'text-[#566a2f]' : 'text-[#22261d] hover:text-[#566a2f]'}
                    after:content-[""] after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-[#566a2f]
                    after:transition-opacity after:duration-200
                    ${active ? 'after:opacity-100' : 'after:opacity-0'}`}
            >
                {label}
            </Link>
        );
    };

    const drawerLink = (to, label, Icon) => (
        <Link
            key={to}
            to={to}
            className="flex items-center gap-3 rounded-xl transition-colors duration-150"
            style={{ padding: '12px 14px', fontSize: 15, fontWeight: 600, color: pathname === to || (to !== '/' && pathname.startsWith(to)) ? '#566a2f' : '#22261d' }}
            onMouseEnter={e => e.currentTarget.style.background = '#eeeae0'}
            onMouseLeave={e => e.currentTarget.style.background = ''}
        >
            {Icon && <Icon size={18} style={{ flexShrink: 0, color: '#566a2f' }} />}
            {label}
        </Link>
    );

    return (
        <>
            <header
                className="sticky top-0 z-50 border-b"
                style={{
                    background: 'rgba(246,244,236,.88)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderColor: 'rgba(34,38,29,.10)',
                }}
            >
                {/* ── DESKTOP ── */}
                <div className="hidden md:flex max-w-[1200px] mx-auto px-7 h-[74px] items-center gap-6">
                    <Link to="/" className="flex items-center gap-3 flex-shrink-0">
                        <img src="/logo.webp" alt="Logo Mates Aconcagua" className="h-10 w-auto flex-shrink-0" />
                        <span style={{ fontFamily: serif }} className="text-[21px] leading-none tracking-[.2px] text-[#22261d]">
                            Mates Aconcagua
                            <small className="block" style={{ fontFamily: "'Karla', sans-serif", fontSize: '10.5px', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#6c7062', marginTop: '3px', fontWeight: 600 }}>
                                Tradición artesanal
                            </small>
                        </span>
                    </Link>

                    <div className="flex-1 max-w-[420px]">
                        <DesktopSearchBar value={searchValue} onChange={setSearchValue} />
                    </div>

                    <nav className="flex items-center gap-6 ml-auto">
                        {navLink('/', 'Inicio')}
                        {navLink('/tienda', 'Catálogo')}
                        {navLink('/acerca', 'Acerca de')}
                    </nav>

                    <div className="flex items-center gap-2.5 flex-shrink-0">
                        <CartButton totalItems={totalItems} />
                        {user ? (
                            <UserMenu
                                user={user} isAdmin={isAdmin}
                                isOpen={isUserMenuOpen}
                                onToggle={() => setIsUserMenuOpen(o => !o)}
                                onSignOut={handleSignOut}
                                onClose={() => setIsUserMenuOpen(false)}
                            />
                        ) : (
                            <Link
                                to="/acceso"
                                className="inline-flex items-center gap-2 h-[42px] px-[18px] rounded-full font-bold text-sm transition-colors duration-200 active:translate-y-px"
                                style={{ background: '#566a2f', color: '#f5f2e6' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#465824'}
                                onMouseLeave={e => e.currentTarget.style.background = '#566a2f'}
                            >
                                <User className="w-4 h-4" />
                                Iniciar Sesión
                            </Link>
                        )}
                    </div>
                </div>

                {/* ── MOBILE ── */}
                <div className="md:hidden relative flex items-center h-[64px] px-4">

                    {/* Izquierda: hamburger */}
                    <button
                        onClick={() => setDrawerOpen(true)}
                        className="flex-shrink-0 transition-colors"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#22261d', padding: 4 }}
                        aria-label="Menú"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    {/* Centro: logo (posición absoluta para centrado perfecto) */}
                    <Link
                        to="/"
                        className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 flex-shrink-0"
                    >
                        <img src="/logo.webp" alt="Logo" className="h-8 w-auto" />
                        <span style={{ fontFamily: serif, fontSize: 17, lineHeight: 1, color: '#22261d' }}>
                            Mates Aconcagua
                        </span>
                    </Link>

                    {/* Derecha: lupa + carrito */}
                    <div className="flex items-center gap-3 ml-auto flex-shrink-0">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#22261d', padding: 4 }}
                            aria-label="Buscar"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>
                        </button>
                        <CartButton totalItems={totalItems} mobile />
                    </div>
                </div>
            </header>

            {/* ── MOBILE DRAWER ── */}
            {/* Backdrop */}
            <div
                className="md:hidden fixed inset-0 z-[60] transition-opacity duration-300"
                style={{
                    background: 'rgba(34,38,29,.45)',
                    backdropFilter: 'blur(2px)',
                    opacity: drawerOpen ? 1 : 0,
                    pointerEvents: drawerOpen ? 'auto' : 'none',
                }}
                onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer panel */}
            <div
                className="md:hidden fixed top-0 left-0 h-full z-[70] flex flex-col"
                style={{
                    width: 280,
                    background: '#f6f4ec',
                    borderRight: '1px solid rgba(34,38,29,.10)',
                    boxShadow: drawerOpen ? '4px 0 24px rgba(34,38,29,.18)' : 'none',
                    transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform .3s cubic-bezier(.4,0,.2,1)',
                    overflowY: 'auto',
                }}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid rgba(34,38,29,.10)' }}>
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo.webp" alt="Logo" className="h-8 w-auto" />
                        <span style={{ fontFamily: serif, fontSize: 17, color: '#22261d', lineHeight: 1 }}>Mates Aconcagua</span>
                    </Link>
                    <button
                        onClick={() => setDrawerOpen(false)}
                        style={{ background: 'none', border: '1px solid rgba(34,38,29,.12)', borderRadius: 8, width: 32, height: 32, display: 'grid', placeItems: 'center', cursor: 'pointer', color: '#6c7062' }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex flex-col p-3 gap-0.5">
                    <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#9a9d90', padding: '8px 14px 4px' }}>Navegación</p>
                    {drawerLink('/', 'Inicio', null)}
                    {drawerLink('/tienda', 'Catálogo', null)}
                    {drawerLink('/acerca', 'Acerca de', null)}
                </nav>

                {/* Divider */}
                <div style={{ height: 1, background: 'rgba(34,38,29,.10)', margin: '4px 16px' }} />

                {/* User section */}
                <div className="flex flex-col p-3 gap-0.5">
                    {user ? (
                        <>
                            {/* User info */}
                            <div className="flex items-center gap-3 px-[14px] py-3">
                                <div
                                    className="flex items-center justify-center rounded-full flex-shrink-0 text-white font-bold text-sm"
                                    style={{ width: 36, height: 36, background: '#566a2f', fontFamily: serif }}
                                >
                                    {(user.name || user.email || 'U')[0].toUpperCase()}
                                </div>
                                <div>
                                    <p style={{ fontSize: 14, fontWeight: 700, color: '#22261d', lineHeight: 1.2 }}>{user.name || 'Usuario'}</p>
                                    <p style={{ fontSize: 12, color: '#7a7d70', marginTop: 2 }}>{user.email}</p>
                                </div>
                            </div>

                            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#9a9d90', padding: '4px 14px' }}>Mi cuenta</p>

                            {drawerLink('/pedidos', 'Mis Pedidos', ShoppingBag)}
                            {isAdmin && drawerLink('/admin', 'Panel Admin', LayoutDashboard)}

                            {/* Cerrar sesión */}
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-3 rounded-xl w-full text-left transition-colors duration-150"
                                style={{ padding: '12px 14px', fontSize: 15, fontWeight: 600, color: '#c06a34', background: 'none', border: 'none', cursor: 'pointer' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#fbeae6'}
                                onMouseLeave={e => e.currentTarget.style.background = ''}
                            >
                                <LogOut size={18} style={{ flexShrink: 0 }} />
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#9a9d90', padding: '4px 14px 8px' }}>Cuenta</p>
                            <Link
                                to="/acceso"
                                className="flex items-center justify-center gap-2 rounded-xl font-bold text-sm active:translate-y-px transition-all"
                                style={{ background: '#566a2f', color: '#f5f2e6', height: 46, margin: '0 4px' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#465824'}
                                onMouseLeave={e => e.currentTarget.style.background = '#566a2f'}
                            >
                                <User size={16} />
                                Iniciar Sesión
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {isSearchOpen && (
                <MobileSearchOverlay
                    value={searchValue}
                    onChange={setSearchValue}
                    onClose={() => { setIsSearchOpen(false); setSearchValue(''); }}
                />
            )}
        </>
    );
}
