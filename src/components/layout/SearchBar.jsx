import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, X } from 'lucide-react';
export function DesktopSearchBar({ value, onChange }) {
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        if (value.trim()) {
            navigate(`/tienda?search=${encodeURIComponent(value.trim())}`);
            onChange('');
        }
    };
    return (<form onSubmit={handleSubmit} className="relative flex-1 max-w-2xl">
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="¿Qué estás buscando?" className="w-full pl-4 pr-12 py-2.5 rounded-full bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all shadow-sm"/>
      <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#566a2f] text-[#f3efe0] p-2 rounded-full hover:bg-[#465824] transition-colors" aria-label="Buscar">
        <Search className="w-4 h-4"/>
      </button>
    </form>);
}
export function MobileSearchOverlay({ value, onChange, onClose }) {
    const navigate = useNavigate();
    const inputRef = useRef(null);
    useEffect(() => {
        inputRef.current?.focus();
    }, []);
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape')
                onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (value.trim()) {
            navigate(`/tienda?search=${encodeURIComponent(value.trim())}`);
            onClose();
            onChange('');
        }
    };
    return (<div className="md:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="flex items-start justify-center pt-24 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-in slide-in-from-top duration-300" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl text-gray-800">Buscar productos</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Cerrar búsqueda">
              <X className="w-6 h-6"/>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
              <input ref={inputRef} type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Buscar productos..." className="w-full pl-12 pr-4 py-3 bg-gray-50 text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"/>
            </div>
            <button type="submit" disabled={!value.trim()} className={`w-full mt-4 py-3 rounded-xl font-semibold transition-all ${value.trim()
            ? 'bg-[#566a2f] hover:bg-[#465824] text-[#f3efe0]'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              Buscar
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">Presiona ESC para cerrar</p>
          </div>
        </div>
      </div>
    </div>);
}
