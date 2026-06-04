import { Link, useLocation } from 'react-router';
import { Menu, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { DesktopSearchBar, MobileSearchOverlay } from './SearchBar';
import { UserMenu } from './UserMenu';
import { CartButton } from './CartButton';

export function Header() {
    const { totalItems } = useCart();
    const { user, signOut, isAdmin } = useAuth();
    const { pathname } = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const handleSignOut = async () => {
        await signOut();
        setIsUserMenuOpen(false);
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

    return (
        <header
            className="sticky top-0 z-50 border-b"
            style={{
                background: 'rgba(246,244,236,.88)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderColor: 'rgba(34,38,29,.10)',
            }}
        >
            <div className="max-w-[1200px] mx-auto px-7 h-[74px] flex items-center gap-6">

                {/* Brand */}
                <Link to="/" className="flex items-center gap-3 flex-shrink-0">
                    <img src="/logo.webp" alt="Logo Mates Aconcagua" className="h-10 w-auto flex-shrink-0" />
                    <span style={{ fontFamily: "'DM Serif Display', Georgia, serif" }} className="text-[21px] leading-none tracking-[.2px] text-[#22261d]">
                        Mates Aconcagua
                        <small className="block" style={{ fontFamily: "'Karla', sans-serif", fontSize: '10.5px', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#6c7062', marginTop: '3px', fontWeight: 600 }}>
                            Tradición artesanal
                        </small>
                    </span>
                </Link>

                {/* Search — desktop */}
                <div className="hidden md:block flex-1 max-w-[420px]">
                    <DesktopSearchBar value={searchValue} onChange={setSearchValue} />
                </div>

                {/* Nav links — desktop */}
                <nav className="hidden md:flex items-center gap-6 ml-auto">
                    {navLink('/', 'Inicio')}
                    {navLink('/tienda', 'Catálogo')}
                    {navLink('/acerca', 'Acerca de')}
                </nav>

                {/* Actions — desktop */}
                <div className="hidden md:flex items-center gap-2.5 flex-shrink-0">
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
                            to="/login"
                            className="inline-flex items-center gap-2 bg-[#566a2f] hover:bg-[#465824] text-[#f5f2e6] h-[42px] px-[18px] rounded-full font-bold text-sm transition-colors duration-200 active:translate-y-px"
                        >
                            <User className="w-4 h-4" />
                            Iniciar Sesión
                        </Link>
                    )}
                </div>

                {/* Mobile actions */}
                <div className="md:hidden flex items-center gap-3 ml-auto">
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="text-[#22261d] hover:text-[#566a2f] transition-colors"
                        aria-label="Buscar"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>
                    </button>
                    <CartButton totalItems={totalItems} mobile />
                    {user ? (
                        <UserMenu user={user} isAdmin={isAdmin} isOpen={isUserMenuOpen} onToggle={() => setIsUserMenuOpen(o => !o)} onSignOut={handleSignOut} onClose={() => setIsUserMenuOpen(false)} mobile />
                    ) : (
                        <Link to="/login" className="text-[#22261d] hover:text-[#566a2f] transition-colors">
                            <User className="w-5 h-5" />
                        </Link>
                    )}
                    <button onClick={() => setIsMenuOpen(o => !o)} className="text-[#22261d] hover:text-[#566a2f] transition-colors">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile nav */}
            {isMenuOpen && (
                <nav className="md:hidden flex flex-col gap-1 px-7 pb-4 border-t" style={{ borderColor: 'rgba(34,38,29,.10)' }}>
                    {[['/', 'Inicio'], ['/tienda', 'Catálogo'], ['/acerca', 'Acerca de'], ...(user ? [['/pedidos', 'Mis Pedidos']] : [])].map(([to, label]) => (
                        <Link key={to} to={to} onClick={() => setIsMenuOpen(false)}
                            className="py-2.5 text-[15px] font-semibold text-[#22261d] hover:text-[#566a2f] transition-colors">
                            {label}
                        </Link>
                    ))}
                </nav>
            )}

            {isSearchOpen && (
                <MobileSearchOverlay value={searchValue} onChange={setSearchValue} onClose={() => { setIsSearchOpen(false); setSearchValue(''); }} />
            )}
        </header>
    );
}
