import { Link, useNavigate } from 'react-router';
import { Home, ShoppingBag, ArrowLeft } from 'lucide-react';
export function NotFound() {
    const navigate = useNavigate();
    return (<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 visual */}
        <div className="mb-8 relative">
          <p className="text-[10rem] font-black text-[#c7e47d] leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl" role="img" aria-label="mate">🧉</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Página no encontrada
        </h1>
        <p className="text-gray-500 mb-10 leading-relaxed">
          La página que buscás no existe o fue movida.<br />
          Mientras tanto, tomemos un mate y volvamos a la tienda.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4"/>
            Volver atrás
          </button>
          <Link to="/" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#a8c95f] hover:bg-[#97b84f] text-[#4a5f2f] font-semibold rounded-lg transition-colors">
            <Home className="w-4 h-4"/>
            Inicio
          </Link>
          <Link to="/tienda" className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4a5f2f] hover:bg-[#3a4f22] text-white font-semibold rounded-lg transition-colors">
            <ShoppingBag className="w-4 h-4"/>
            Ver tienda
          </Link>
        </div>
      </div>
    </div>);
}
