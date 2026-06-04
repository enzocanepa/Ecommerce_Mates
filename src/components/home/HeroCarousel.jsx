import { Link } from 'react-router';

export function HeroCarousel() {
    return (
        <section className="relative overflow-hidden">
            <img
                src="/hero-home.png"
                alt="Persona tomando mate frente a las montañas"
                className="absolute inset-0 w-full h-full object-cover object-right"
            />
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(100deg,rgba(18,22,12,.9) 0%,rgba(20,25,14,.74) 40%,rgba(20,25,14,.34) 66%,rgba(20,25,14,0) 92%)' }}
            />
            <div className="relative max-w-[1200px] mx-auto px-6 md:px-7 py-16 md:py-24 lg:py-28">
                <div className="max-w-[560px]" style={{ color: '#f5f2e6' }}>

                    {/* Eyebrow */}
                    <span className="inline-flex items-center gap-2.5 text-[#cdd6b0] text-[11px] md:text-[12.5px] font-bold tracking-[2.5px] uppercase mb-4 md:mb-[22px]">
                        <span className="inline-block w-5 md:w-6 h-px bg-[#cdd6b0]" />
                        Artesanal · Desde la cordillera
                    </span>

                    {/* Heading */}
                    <h1
                        className="text-[36px] md:text-[52px] lg:text-[60px] leading-[1.14] tracking-[-0.5px] mb-5 md:mb-[34px]"
                        style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                    >
                        El ritual del mate,<br />
                        <em style={{ fontStyle: 'italic', color: '#dcc7a0' }}>hecho a mano</em>
                    </h1>

                    {/* Body */}
                    <p
                        className="text-base md:text-[18.5px] leading-[1.6] mb-6 md:mb-[34px] max-w-[450px]"
                        style={{ color: 'rgba(245,242,230,.9)' }}
                    >
                        Mates de calabaza, algarrobo y acero seleccionados pieza por pieza. Calidad que se hereda, con envío gratis a todo el país.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-3 mb-6 md:mb-[38px]">
                        <Link
                            to="/tienda"
                            className="inline-flex items-center gap-2 font-bold text-sm md:text-base rounded-full transition-all duration-200 active:translate-y-px"
                            style={{
                                background: '#c06a34',
                                color: '#fff',
                                height: '48px',
                                padding: '0 22px',
                                boxShadow: '0 8px 22px rgba(192,106,52,.32)',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#ab5b2a'}
                            onMouseLeave={e => e.currentTarget.style.background = '#c06a34'}
                        >
                            Ver catálogo
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>
                        </Link>
                        <Link
                            to="/acerca"
                            className="inline-flex items-center justify-center font-bold text-sm md:text-base rounded-full transition-all duration-200 active:translate-y-px"
                            style={{
                                background: 'transparent',
                                border: '1.5px solid rgba(245,242,230,.5)',
                                color: '#f5f2e6',
                                height: '48px',
                                padding: '0 20px',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(245,242,230,.12)'; e.currentTarget.style.borderColor = '#f5f2e6'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(245,242,230,.5)'; }}
                        >
                            Conocé la marca
                        </Link>
                    </div>

                    {/* Trust signals */}
                    <div className="hidden sm:flex flex-wrap gap-5 md:gap-6">
                        <span className="flex items-center gap-2 text-[12.5px] md:text-[13.5px] font-semibold" style={{ color: 'rgba(245,242,230,.92)' }}>
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#cdd6b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/></svg>
                            Envío gratis
                        </span>
                        <span className="flex items-center gap-2 text-[12.5px] md:text-[13.5px] font-semibold" style={{ color: 'rgba(245,242,230,.92)' }}>
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#cdd6b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
                            Despacho 24–48hs
                        </span>
                        <span className="flex items-center gap-2 text-[12.5px] md:text-[13.5px] font-semibold" style={{ color: 'rgba(245,242,230,.92)' }}>
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#cdd6b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 5v6c0 5 3.5 8 8 11 4.5-3 8-6 8-11V5l-8-3Z"/></svg>
                            Compra segura
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
