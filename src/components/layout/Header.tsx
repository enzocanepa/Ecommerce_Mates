import { Link } from 'react-router';
import { Menu, User, Search } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { DesktopSearchBar, MobileSearchOverlay } from './SearchBar';
import { UserMenu } from './UserMenu';
import { CartButton } from './CartButton';

export function Header() {
  const { totalItems } = useCart();
  const { user, signOut, isAdmin } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-[#a8c95f] text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center gap-2 flex-shrink-0">
            <img src="/logo.png" alt="Logo Mates Aconcagua" className="h-18 w-auto" />
          </Link>

          {/* Desktop: barra de búsqueda + links */}
          <div className="hidden md:flex items-center gap-6 flex-1 max-w-4xl mx-auto">
            <DesktopSearchBar value={searchValue} onChange={setSearchValue} />
            <Link to="/" className="hover:text-white/80 transition-colors whitespace-nowrap">Inicio</Link>
            <Link to="/tienda" className="hover:text-white/80 transition-colors whitespace-nowrap">Catálogo</Link>
            <Link to="/acerca" className="hover:text-white/80 transition-colors whitespace-nowrap">Acerca de</Link>
          </div>

          {/* Desktop: acciones */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <CartButton totalItems={totalItems} />
            {user ? (
              <UserMenu
                user={user}
                isAdmin={isAdmin}
                isOpen={isUserMenuOpen}
                onToggle={() => setIsUserMenuOpen(o => !o)}
                onSignOut={handleSignOut}
                onClose={() => setIsUserMenuOpen(false)}
              />
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-[#c7e47d] hover:bg-[#b8d66e] text-[#4a5f2f] px-4 py-2 rounded-lg transition-colors"
              >
                <User className="w-5 h-5" />
                <span>Iniciar Sesión</span>
              </Link>
            )}
          </div>

          {/* Mobile: acciones */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hover:text-green-200 transition-colors"
              aria-label="Buscar productos"
            >
              <Search className="w-5 h-5" />
            </button>

            <CartButton totalItems={totalItems} mobile />

            {user ? (
              <UserMenu
                user={user}
                isAdmin={isAdmin}
                isOpen={isUserMenuOpen}
                onToggle={() => setIsUserMenuOpen(o => !o)}
                onSignOut={handleSignOut}
                onClose={() => setIsUserMenuOpen(false)}
                mobile
              />
            ) : (
              <Link to="/login" className="hover:text-green-200 transition-colors">
                <User className="w-5 h-5" />
              </Link>
            )}

            <button
              onClick={() => setIsMenuOpen(o => !o)}
              className="hover:text-green-200 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile: menú de navegación */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-3 pb-2 border-t border-white/20 pt-4">
            <Link to="/" className="hover:text-green-200 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
            <Link to="/tienda" className="hover:text-green-200 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Catálogo</Link>
            <Link to="/acerca" className="hover:text-green-200 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Acerca de</Link>
            {user && (
              <Link to="/pedidos" className="hover:text-green-200 transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Mis Pedidos</Link>
            )}
          </nav>
        )}
      </div>

      {/* Mobile: overlay de búsqueda */}
      {isSearchOpen && (
        <MobileSearchOverlay
          value={searchValue}
          onChange={setSearchValue}
          onClose={() => { setIsSearchOpen(false); setSearchValue(''); }}
        />
      )}
    </header>
  );
}
