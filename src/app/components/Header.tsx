import { Link, useNavigate } from 'react-router';
import { ShoppingCart, Menu, User, LogOut, Package, Search, X, LayoutDashboard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState, useRef, useEffect } from 'react';

export function Header() {
  const { totalItems } = useCart();
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/tienda?search=${encodeURIComponent(searchValue.trim())}`);
      setIsSearchOpen(false);
      setSearchValue('');
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchValue('');
  };

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchValue('');
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSearchOpen]);

  return (
    <header className="bg-[#a8c95f] text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center gap-2 flex-shrink-0">
            <img src="../../../../logo.png" alt="Logo Home" className="h-18 w-auto" />
          </Link>

          {/* Desktop Navigation & Search */}
          <div className="hidden md:flex items-center gap-6 flex-1 max-w-4xl mx-auto">
            {/* Desktop Search Bar - Always Visible */}
            <form onSubmit={handleSearch} className="relative flex-1 max-w-2xl">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="¿Qué estás buscando?"
                className="w-full pl-4 pr-12 py-2.5 rounded-full bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#c7e47d] text-[#4a5f2f] p-2 rounded-full hover:bg-[#b8d66e] transition-colors"
                aria-label="Buscar"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Navigation Links */}
            <Link to="/" className="hover:text-white/80 transition-colors whitespace-nowrap">
              Inicio
            </Link>
            <Link to="/tienda" className="hover:text-white/80 transition-colors whitespace-nowrap">
              Catálogo
            </Link>
            <Link to="/acerca" className="hover:text-white/80 transition-colors whitespace-nowrap">
              Acerca de
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <Link
              to="/carrito"
              className="flex items-center gap-2 bg-[#c7e47d] hover:bg-[#b8d66e] text-[#4a5f2f] px-4 py-2 rounded-lg transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Carrito</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-[#c7e47d] hover:bg-[#b8d66e] text-[#4a5f2f] px-4 py-2 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>{user.name || user.email}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2">
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-[#4a5f2f] font-medium"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Panel Admin
                      </Link>
                    )}
                    <Link
                      to="/pedidos"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package className="w-4 h-4" />
                      Mis Pedidos
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
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

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-3">
            {/* Search Icon Mobile */}
            <button
              onClick={toggleSearch}
              className="hover:text-green-200 transition-colors"
              aria-label="Buscar productos"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Icon Mobile */}
            <Link
              to="/carrito"
              className="relative hover:text-green-200 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Icon Mobile */}
            {user ? (
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="hover:text-green-200 transition-colors"
              >
                <User className="w-5 h-5" />
              </button>
            ) : (
              <Link
                to="/login"
                className="hover:text-green-200 transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:text-green-200 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-3 pb-2 border-t border-white/20 pt-4">
            <Link
              to="/"
              className="hover:text-green-200 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              to="/tienda"
              className="hover:text-green-200 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Catálogo
            </Link>
            <Link
              to="/acerca"
              className="hover:text-green-200 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Acerca de
            </Link>
            {user && (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 hover:text-green-200 transition-colors py-2 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Panel Admin
                  </Link>
                )}
                <Link
                  to="/pedidos"
                  className="flex items-center gap-2 hover:text-green-200 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Package className="w-5 h-5" />
                  Mis Pedidos
                </Link>
              </>
            )}
          </nav>
        )}

        {/* Mobile User Dropdown */}
        {isUserMenuOpen && user && (
          <div className="md:hidden mt-4 bg-[#8fb84d] rounded-lg p-3 animate-in slide-in-from-top duration-300">
            <p className="text-sm mb-3 pb-2 border-b border-white/20">
              {user.name || user.email}
            </p>
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-2 py-2 hover:text-green-200 transition-colors font-medium"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <LayoutDashboard className="w-4 h-4" />
                Panel Admin
              </Link>
            )}
            <Link
              to="/pedidos"
              className="flex items-center gap-2 py-2 hover:text-green-200 transition-colors"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <Package className="w-4 h-4" />
              Mis Pedidos
            </Link>
            <button
              onClick={() => {
                handleSignOut();
                setIsUserMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 py-2 hover:text-green-200 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>

      {/* Mobile Search Modal Overlay */}
      {isSearchOpen && (
        <div
          className="md:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={toggleSearch}
        >
          <div className="flex items-start justify-center pt-24 px-4">
            <div
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-in slide-in-from-top duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl text-gray-800">Buscar productos</h3>
                <button
                  onClick={toggleSearch}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Cerrar búsqueda"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Buscar productos..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!searchValue.trim()}
                  className={`w-full mt-4 py-3 rounded-xl transition-all ${
                    searchValue.trim()
                      ? 'bg-[#c7e47d] hover:bg-[#b8d66e] text-[#4a5f2f]'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Buscar
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Presiona ESC para cerrar
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}