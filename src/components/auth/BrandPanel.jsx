import { Link } from 'react-router';

const serif = "'DM Serif Display', Georgia, serif";

export function BrandPanel({ mode }) {
    return (
        <div
            className="hidden lg:flex relative overflow-hidden flex-col justify-between"
            style={{ background: '#2c361a', color: '#f5f2e6', padding: '46px 52px' }}
        >
            <img
                src="/hero-home.png"
                alt="Mate frente a la cordillera"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ objectPosition: 'center right', opacity: 0.82 }}
            />
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg,rgba(28,32,18,.55) 0%,rgba(28,32,18,.34) 40%,rgba(28,32,18,.82) 100%)' }}
            />

            {/* Logo */}
            <Link to="/" className="relative z-10 inline-flex items-center gap-3">
                <img src="/logo.webp" alt="Logo Mates Aconcagua" className="h-12 w-auto flex-shrink-0" />
                <span>
                    <span style={{ fontFamily: serif, fontSize: '22px', lineHeight: 1, color: '#f3efe0', display: 'block' }}>
                        Mates Aconcagua
                    </span>
                    <small style={{ fontFamily: "'Karla', sans-serif", fontSize: '10.5px', letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(245,242,230,.7)', marginTop: '3px', fontWeight: 600, display: 'block' }}>
                        Tradición artesanal
                    </small>
                </span>
            </Link>

            {/* Headline */}
            <div className="relative z-10 max-w-[440px]">
                <span
                    className="inline-flex items-center gap-2.5 text-[12px] font-bold tracking-[2.5px] uppercase mb-[18px]"
                    style={{ color: '#cdd6b0' }}
                >
                    <span className="inline-block w-[26px] h-px flex-shrink-0" style={{ background: '#cdd6b0' }} />
                    Tu cuenta
                </span>
                <h2
                    className="text-[38px] lg:text-[42px] leading-[1.12] tracking-[-0.4px] mb-4"
                    style={{ fontFamily: serif, textShadow: '0 2px 20px rgba(0,0,0,.35)' }}
                >
                    {mode === 'login' ? (
                        <>Bienvenido de nuevo a la <em style={{ fontStyle: 'italic', color: '#dcc7a0' }}>ronda</em></>
                    ) : (
                        <>Sumate a la <em style={{ fontStyle: 'italic', color: '#dcc7a0' }}>tradición</em> del mate</>
                    )}
                </h2>
                <p style={{ fontSize: '16.5px', color: 'rgba(245,242,230,.86)', maxWidth: '400px', lineHeight: 1.6 }}>
                    {mode === 'login'
                        ? 'Accedé para seguir tus pedidos, guardar favoritos y comprar más rápido.'
                        : 'Creá tu cuenta para comprar en segundos, seguir tus envíos y recibir novedades.'}
                </p>
            </div>

            {/* Trust signals */}
            <div className="relative z-10 flex flex-wrap gap-6">
                {[
                    {
                        label: 'Envío gratis',
                        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/></svg>,
                    },
                    {
                        label: 'Compra segura',
                        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2 4 5v6c0 5 3.5 8 8 11 4.5-3 8-6 8-11V5l-8-3Z"/></svg>,
                    },
                    {
                        label: 'Devoluciones 30 días',
                        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>,
                    },
                ].map(({ label, icon }) => (
                    <span key={label} className="flex items-center gap-2.5 text-[13.5px] font-semibold" style={{ color: 'rgba(245,242,230,.92)' }}>
                        <span style={{ color: '#cdd6b0', flexShrink: 0 }}>{icon}</span>
                        {label}
                    </span>
                ))}
            </div>
        </div>
    );
}
