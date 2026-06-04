import { usePageSEO } from '../hooks/usePageSEO';
import { Link } from 'react-router';

const serif = "'DM Serif Display', Georgia, serif";

const valores = [
    {
        icon: (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/>
            </svg>
        ),
        title: 'Pasión',
        desc: 'Amamos lo que hacemos y se nota en cada producto que ofrecemos.',
    },
    {
        icon: (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="6"/><path d="M8.2 13.5 7 22l5-3 5 3-1.2-8.5"/>
            </svg>
        ),
        title: 'Calidad',
        desc: 'Solo trabajamos con productos de primera calidad, probados y seleccionados.',
    },
    {
        icon: (
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/>
            </svg>
        ),
        title: 'Servicio',
        desc: 'Envío rápido y atención personalizada para que disfrutes de tu compra.',
    },
];

function Eyebrow({ children, color = '#c06a34', center = false }) {
    return (
        <span
            className={`inline-flex items-center gap-2.5 text-[12.5px] font-bold tracking-[2.5px] uppercase mb-[18px] ${center ? 'justify-center' : ''}`}
            style={{ color }}
        >
            <span className="inline-block w-[26px] h-px flex-shrink-0" style={{ background: color }} />
            {children}
            <span className="inline-block w-[26px] h-px flex-shrink-0" style={{ background: color }} />
        </span>
    );
}

export function About() {
    usePageSEO({
        title: 'Acerca de — Mates Aconcagua',
        description: 'Conocé nuestra historia, valores y pasión por el mate artesanal.',
    });

    return (
        <div style={{ background: '#f6f4ec' }}>

            {/* ── HERO ─────────────────────────────────────────────── */}
            <section className="relative overflow-hidden" style={{ background: '#2c361a' }}>
                <img
                    src="/banner-mate.png"
                    alt="Manos compartiendo mate al atardecer en la montaña"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: 'center 38%', opacity: .9 }}
                />
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(180deg,rgba(28,32,18,.42) 0%,rgba(28,32,18,.32) 45%,rgba(28,32,18,.7) 100%)' }}
                />
                <div className="relative text-center px-6 py-24 md:py-[118px] max-w-[860px] mx-auto" style={{ color: '#fdf8ec' }}>
                    <div className="flex justify-center mb-[18px]">
                        <Eyebrow color="#c4b78f" center>Nuestra esencia</Eyebrow>
                    </div>
                    <h1
                        className="text-[36px] md:text-[48px] lg:text-[54px] leading-[1.12] tracking-[-0.5px] mb-5"
                        style={{ fontFamily: serif, textWrap: 'balance', textShadow: '0 2px 24px rgba(0,0,0,.45)' }}
                    >
                        Acerca de Mates Aconcagua
                    </h1>
                    <p
                        className="text-base md:text-[18px]"
                        style={{ color: 'rgba(253,248,236,.92)', textShadow: '0 1px 14px rgba(0,0,0,.4)' }}
                    >
                        Compartiendo la tradición del mate, una ronda a la vez.
                    </p>
                </div>
            </section>

            {/* ── HISTORIA ─────────────────────────────────────────── */}
            <section className="py-16 md:py-[90px]">
                <div className="max-w-[1200px] mx-auto px-6 md:px-7 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-[60px] items-center">

                    {/* Text */}
                    <div>
                        <Eyebrow>Nuestra historia</Eyebrow>
                        <h2
                            className="text-[30px] md:text-[38px] lg:text-[42px] leading-[1.1] tracking-[-0.3px] mb-[22px]"
                            style={{ fontFamily: serif }}
                        >
                            Pasión por el ritual del mate
                        </h2>
                        <p className="text-[15px] md:text-[16.5px] leading-[1.7] mb-4" style={{ color: '#3f443a', maxWidth: '540px' }}>
                            Mates Aconcagua nació de la pasión por mantener viva una de las tradiciones más hermosas de Latinoamérica. Sabemos que el mate es más que una bebida: es un momento de encuentro, de conversación, de compartir.
                        </p>
                        <p className="text-[15px] md:text-[16.5px] leading-[1.7] mb-4" style={{ color: '#3f443a', maxWidth: '540px' }}>
                            Por eso seleccionamos cuidadosamente cada uno de nuestros productos, trabajando con artesanos locales y las mejores marcas del mercado para ofrecerte calidad garantizada.
                        </p>
                        <p className="text-[15px] md:text-[16.5px] leading-[1.7]" style={{ color: '#3f443a', maxWidth: '540px' }}>
                            Nuestro compromiso es brindarte no solo productos de excelencia, sino también una experiencia de compra única que honre la tradición del mate.
                        </p>
                    </div>

                    {/* Media — tag en bottom-right */}
                    <div className="relative mt-4 md:mt-0 mb-6 md:mb-0 md:pb-5">
                        <img
                            src="/hero-home.png"
                            alt="Mate artesanal"
                            className="w-full object-cover rounded-[20px]"
                            style={{ aspectRatio: '4/5', boxShadow: '0 10px 30px rgba(34,38,29,.12)' }}
                        />
                        <div
                            className="absolute rounded-[14px] text-white bottom-4 right-4 md:bottom-[-18px] md:right-[-18px]"
                            style={{
                                background: '#c06a34',
                                padding: '14px 18px',
                                boxShadow: '0 14px 30px rgba(192,106,52,.3)',
                            }}
                        >
                            <b style={{ fontFamily: serif, fontSize: '22px', display: 'block', lineHeight: 1 }}>
                                +15 años
                            </b>
                            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '.4px' }}>
                                compartiendo mate
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── VALORES ──────────────────────────────────────────── */}
            <section
                className="py-16 md:py-[90px]"
                style={{ background: '#fff', borderTop: '1px solid rgba(34,38,29,.10)', borderBottom: '1px solid rgba(34,38,29,.10)' }}
            >
                <div className="max-w-[1200px] mx-auto px-6 md:px-7">

                    {/* Header */}
                    <div className="text-center max-w-[600px] mx-auto mb-10 md:mb-[50px]">
                        <div className="flex justify-center">
                            <Eyebrow center>Lo que nos mueve</Eyebrow>
                        </div>
                        <h2
                            className="text-[30px] md:text-[38px] lg:text-[42px] leading-[1.1] tracking-[-0.3px] text-[#22261d]"
                            style={{ fontFamily: serif }}
                        >
                            Nuestros valores
                        </h2>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[26px]">
                        {valores.map(({ icon, title, desc }) => (
                            <div
                                key={title}
                                className="valor-card rounded-2xl text-center"
                                style={{
                                    background: '#f6f4ec',
                                    border: '1px solid rgba(34,38,29,.10)',
                                    padding: '38px 30px',
                                }}
                            >
                                <span
                                    className="w-16 h-16 rounded-[18px] grid place-items-center mx-auto mb-[22px] text-[#566a2f]"
                                    style={{ background: '#eef0e3' }}
                                >
                                    {icon}
                                </span>
                                <h3
                                    className="text-2xl mb-3 text-[#22261d]"
                                    style={{ fontFamily: serif }}
                                >
                                    {title}
                                </h3>
                                <p className="text-[15px] leading-[1.6] text-[#6c7062]">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ──────────────────────────────────────────────── */}
            <section className="py-16 md:py-[90px]">
                <div className="max-w-[1200px] mx-auto px-6 md:px-7">
                    <div
                        className="relative overflow-hidden rounded-3xl text-center px-8 md:px-10 py-14 md:py-16"
                        style={{
                            background: 'linear-gradient(135deg,#566a2f 0%,#465824 100%)',
                            color: '#f5f2e6',
                        }}
                    >
                        {/* Círculo decorativo */}
                        <span
                            className="absolute rounded-full pointer-events-none"
                            style={{
                                width: '280px', height: '280px',
                                background: 'rgba(255,255,255,.05)',
                                right: '-80px', top: '-80px',
                            }}
                        />

                        <h2
                            className="relative text-[28px] md:text-[36px] lg:text-[40px] leading-[1.1] mb-3.5"
                            style={{ fontFamily: serif }}
                        >
                            ¿Tenés alguna pregunta?
                        </h2>
                        <p
                            className="relative text-base md:text-[17px] mb-7 md:mb-[30px]"
                            style={{ color: 'rgba(245,242,230,.85)' }}
                        >
                            Estamos para ayudarte. Escribinos y te respondemos a la brevedad.
                        </p>
                        <div className="relative flex flex-wrap gap-3.5 justify-center">
                            <a
                                href="mailto:contacto@matesaconcagua.com.ar"
                                className="inline-flex items-center gap-2 font-bold rounded-full transition-all duration-200 active:translate-y-px"
                                style={{
                                    background: '#c06a34',
                                    color: '#fff',
                                    height: '50px',
                                    padding: '0 26px',
                                    fontSize: '15.5px',
                                    boxShadow: '0 8px 22px rgba(192,106,52,.32)',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#ab5b2a'}
                                onMouseLeave={e => e.currentTarget.style.background = '#c06a34'}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>
                                Escribinos
                            </a>
                            <Link
                                to="/tienda"
                                className="inline-flex items-center justify-center font-bold rounded-full transition-all duration-200 active:translate-y-px"
                                style={{
                                    background: '#fff',
                                    border: '1px solid rgba(34,38,29,.18)',
                                    color: '#22261d',
                                    height: '50px',
                                    padding: '0 24px',
                                    fontSize: '15.5px',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#566a2f'; e.currentTarget.style.color = '#566a2f'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(34,38,29,.18)'; e.currentTarget.style.color = '#22261d'; }}
                            >
                                Ver catálogo
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
