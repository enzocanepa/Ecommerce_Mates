import { Link } from 'react-router';
import { User, LogOut, Package, LayoutDashboard } from 'lucide-react';
export function UserMenu({ user, isAdmin, isOpen, onToggle, onSignOut, onClose, mobile = false }) {
    if (mobile) {
        return (<>
        <button onClick={onToggle} className="hover:text-green-200 transition-colors">
          <User className="w-5 h-5"/>
        </button>

        {isOpen && (<div className="md:hidden mt-4 bg-[#8fb84d] rounded-lg p-3 animate-in slide-in-from-top duration-300">
            <p className="text-sm mb-3 pb-2 border-b border-white/20">{user.name || user.email}</p>
            {isAdmin && (<Link to="/admin" className="flex items-center gap-2 py-2 hover:text-green-200 transition-colors font-medium" onClick={onClose}>
                <LayoutDashboard className="w-4 h-4"/>
                Panel Admin
              </Link>)}
            <Link to="/pedidos" className="flex items-center gap-2 py-2 hover:text-green-200 transition-colors" onClick={onClose}>
              <Package className="w-4 h-4"/>
              Mis Pedidos
            </Link>
            <button onClick={() => { onSignOut(); onClose(); }} className="w-full flex items-center gap-2 py-2 hover:text-green-200 transition-colors text-left">
              <LogOut className="w-4 h-4"/>
              Cerrar Sesión
            </button>
          </div>)}
      </>);
    }
    return (<div className="relative">
      <button
        onClick={onToggle}
        className="inline-flex items-center gap-2 font-bold text-[14.5px] rounded-full h-[42px] px-4 transition-all duration-200 active:translate-y-px"
        style={{ background: '#fff', border: '1px solid rgba(34,38,29,.18)', color: '#22261d' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#566a2f'; e.currentTarget.style.color = '#566a2f'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(34,38,29,.18)'; e.currentTarget.style.color = '#22261d'; }}
      >
        <User className="w-[17px] h-[17px]"/>
        <span>{user.name || user.email}</span>
      </button>

      {isOpen && (<div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-10">
          {isAdmin && (<Link to="/admin" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-[#4a5f2f] font-medium" onClick={onClose}>
              <LayoutDashboard className="w-4 h-4"/>
              Panel Admin
            </Link>)}
          <Link to="/pedidos" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100" onClick={onClose}>
            <Package className="w-4 h-4"/>
            Mis Pedidos
          </Link>
          <button onClick={() => { onSignOut(); onClose(); }} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left">
            <LogOut className="w-4 h-4"/>
            Cerrar Sesión
          </button>
        </div>)}
    </div>);
}
