import { Link } from 'react-router';

export function Footer() {
    return (
        <footer style={{ background: '#465824', color: '#e7e6d6' }}>
            <div className="max-w-[1200px] mx-auto px-6 md:px-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-11 pt-12 md:pt-16 pb-8 md:pb-10">

                {/* Brand */}
                <div>
                    <Link to="/" className="inline-flex items-center gap-3 mb-[18px]">
                        <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#f3efe0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 0 2px rgba(243,239,224,.2)' }}>
                            <img src="/logo.webp" alt="Logo Mates Aconcagua" style={{ height: 34, width: 'auto' }} />
                        </div>
                        <span>
                        <span style={{ color: '#f3efe0', fontFamily: "'DM Serif Display', Georgia, serif", fontSize: '21px', lineHeight: 1, letterSpacing: '.2px', display: 'block' }}>
                            Mates Aconcagua
                        </span>
                        <small style={{ fontFamily: "'Karla', sans-serif", fontSize: '10.5px', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#b8bda3', marginTop: '3px', fontWeight: 600, display: 'block' }}>
                            Tradición artesanal
                        </small>
                    </span>
                    </Link>
                    <p style={{ fontSize: '14.5px', lineHeight: 1.6, color: 'rgba(231,230,214,.78)', maxWidth: '300px' }}>
                        La tradición del mate en tus manos. Productos artesanales con envío gratis a todo el país.
                    </p>
                </div>

                {/* Nav */}
                <div>
                    <h5 style={{ fontFamily: "'Karla', sans-serif", fontSize: '13px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#cdd0b8', marginBottom: '18px' }}>
                        Navegación
                    </h5>
                    <ul className="flex flex-col gap-2.5">
                        {[['/', 'Inicio'], ['/tienda', 'Catálogo'], ['/acerca', 'Acerca de'], ['/pedidos', 'Mis pedidos']].map(([to, label]) => (
                            <li key={to}>
                                <Link to={to} style={{ fontSize: '14.5px', color: 'rgba(231,230,214,.82)', transition: 'color .2s' }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(231,230,214,.82)'}
                                >
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h5 style={{ fontFamily: "'Karla', sans-serif", fontSize: '13px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#cdd0b8', marginBottom: '18px' }}>
                        Contacto
                    </h5>
                    <ul className="flex flex-col">
                        <li className="flex gap-2.5 mb-3" style={{ fontSize: '14px', color: 'rgba(231,230,214,.82)', lineHeight: 1.45 }}>
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#c4b78f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>
                            <a href="mailto:lorenzocona14@gmail.com"
                                style={{ color: 'rgba(231,230,214,.82)', transition: 'color .2s' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                onMouseLeave={e => e.currentTarget.style.color = 'rgba(231,230,214,.82)'}
                            >
                                lorenzocona14@gmail.com
                            </a>
                        </li>
                        <li className="flex gap-2.5 mb-3" style={{ fontSize: '14px', color: 'rgba(231,230,214,.82)', lineHeight: 1.45 }}>
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#c4b78f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/></svg>
                            Envíos 24–48hs Gran Mendoza · 3–7 días interior
                        </li>
                        <li className="flex gap-2.5" style={{ fontSize: '14px', color: 'rgba(231,230,214,.82)', lineHeight: 1.45 }}>
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#c4b78f" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>
                            Devoluciones hasta 30 días
                        </li>
                    </ul>
                </div>
            </div>

            <div
                className="text-center py-[22px] text-[13px]"
                style={{ borderTop: '1px solid rgba(231,230,214,.16)', color: 'rgba(231,230,214,.6)' }}
            >
                © 2026 Mates Aconcagua. Todos los derechos reservados.
            </div>
        </footer>
    );
}
