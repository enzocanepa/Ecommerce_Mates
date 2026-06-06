import { Link, useNavigate } from 'react-router';
import { Home, ShoppingBag, ArrowLeft } from 'lucide-react';

const serif = "'DM Serif Display', Georgia, serif";

export function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#f6f4ec' }}>
            <div className="max-w-md w-full text-center">

                {/* 404 */}
                <div className="relative flex items-center justify-center mb-6 select-none" style={{ height: 160 }}>
                    <span
                        style={{
                            fontFamily: serif,
                            fontSize: 'clamp(120px, 28vw, 160px)',
                            lineHeight: 1,
                            color: 'rgba(86,106,47,.13)',
                            letterSpacing: '-4px',
                            userSelect: 'none',
                        }}
                    >
                        404
                    </span>
                    <span
                        className="absolute"
                        style={{ fontSize: 72 }}
                        role="img"
                        aria-label="mate"
                    >
                        🧉
                    </span>
                </div>

                <h1
                    className="mb-3"
                    style={{ fontFamily: serif, fontSize: 34, color: '#22261d', letterSpacing: '-.3px', lineHeight: 1.1 }}
                >
                    Página no encontrada
                </h1>
                <p style={{ color: '#6c7062', fontSize: 15, lineHeight: 1.65, marginBottom: 36 }}>
                    La página que buscás no existe o fue movida.<br />
                    Mientras tanto, tomemos un mate y volvamos a la tienda.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center gap-2 font-bold text-sm rounded-full transition-all duration-200 active:translate-y-px"
                        style={{ height: 46, padding: '0 20px', background: '#fff', border: '1px solid rgba(34,38,29,.18)', color: '#22261d', cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#566a2f'; e.currentTarget.style.color = '#566a2f'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(34,38,29,.18)'; e.currentTarget.style.color = '#22261d'; }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver atrás
                    </button>
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 font-bold text-sm rounded-full transition-all duration-200 active:translate-y-px"
                        style={{ height: 46, padding: '0 20px', background: '#fff', border: '1px solid rgba(34,38,29,.18)', color: '#22261d' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#566a2f'; e.currentTarget.style.color = '#566a2f'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(34,38,29,.18)'; e.currentTarget.style.color = '#22261d'; }}
                    >
                        <Home className="w-4 h-4" />
                        Inicio
                    </Link>
                    <Link
                        to="/tienda"
                        className="inline-flex items-center justify-center gap-2 font-bold text-sm rounded-full transition-all duration-200 active:translate-y-px"
                        style={{ height: 46, padding: '0 20px', background: '#566a2f', color: '#f5f2e6', border: '1px solid transparent' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#465824'}
                        onMouseLeave={e => e.currentTarget.style.background = '#566a2f'}
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Ver tienda
                    </Link>
                </div>
            </div>
        </div>
    );
}
