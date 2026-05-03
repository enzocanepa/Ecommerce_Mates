import { Link } from 'react-router';
import { Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#4a5f2f] text-white mt-16">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          <div>
            <img src="/logo.png" alt="Mates Aconcagua" className="h-12 w-auto mb-3" />
            <p className="text-sm text-white/70 leading-relaxed">
              La tradición del mate en tus manos. Productos artesanales con envío gratis a todo el país.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-[#c7e47d]">Navegación</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link to="/tienda" className="hover:text-white transition-colors">Catálogo</Link></li>
              <li><Link to="/acerca" className="hover:text-white transition-colors">Acerca de</Link></li>
              <li><Link to="/pedidos" className="hover:text-white transition-colors">Mis Pedidos</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3 text-[#c7e47d]">Contacto</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:contacto@matesaconcagua.com.ar" className="hover:text-white transition-colors">
                  contacto@matesaconcagua.com.ar
                </a>
              </li>
              <li>Envíos: 24-48hs CABA/GBA · 3-7 días interior</li>
              <li>Devoluciones hasta 30 días</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/20 pt-6 text-center text-xs text-white/50">
          © 2026 Mates Aconcagua. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
