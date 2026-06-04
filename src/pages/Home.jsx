import { usePageSEO } from '../hooks/usePageSEO';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { BenefitsBar } from '../components/home/BenefitsBar';

export function Home() {
    usePageSEO({
        title: 'Mates Aconcagua',
        description: 'Tienda online de mates artesanales, bombillas y yerba mate premium. Envío gratis a todo el país.',
    });
    return (
        <div>
            <HeroCarousel />
            <BenefitsBar />
            <FeaturedProducts />

            {/* Tradición del mate */}
            <section style={{ background: '#2c361a', color: '#f1eedf' }}>
                <div className="max-w-[1200px] mx-auto px-6 md:px-7 py-16 md:py-[92px] grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">

                    {/* Text */}
                    <div>
                        <span className="inline-flex items-center gap-2.5 text-[11px] md:text-[12.5px] font-bold tracking-[2.5px] uppercase mb-4 md:mb-5" style={{ color: '#c4b78f' }}>
                            <span className="inline-block w-5 h-px" style={{ background: '#c4b78f' }} />
                            Nuestra esencia
                        </span>
                        <h2
                            className="text-[32px] md:text-[40px] lg:text-[46px] leading-[1.08] tracking-[-0.3px] mb-5 md:mb-[22px]"
                            style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                        >
                            La tradición del mate
                        </h2>
                        <p className="text-[15px] md:text-[17px] leading-[1.7] mb-4 md:mb-[18px]" style={{ color: 'rgba(241,238,223,.82)' }}>
                            El mate es más que una bebida: es un ritual que une a familias y amigos. En Mates Aconcagua encontrás todo lo necesario para mantener viva esta hermosa costumbre.
                        </p>
                        <p className="text-[15px] md:text-[17px] leading-[1.7]" style={{ color: 'rgba(241,238,223,.82)' }}>
                            Desde mates artesanales curados a mano hasta termos de última generación, seleccionamos cada pieza para que el ritual te acompañe durante años.
                        </p>
                        <p
                            className="text-[18px] md:text-[21px] italic mt-5 md:mt-[26px]"
                            style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: '#dcc7a0' }}
                        >
                            — Hecho con manos argentinas
                        </p>
                    </div>

                    {/* Media — tag inside on mobile, offset outside on desktop */}
                    <div className="relative mt-4 md:mt-0 mb-6 md:mb-0 md:pb-5">
                        <img
                            src="/hero-home.png"
                            alt="Mate artesanal"
                            className="w-full object-cover rounded-[20px]"
                            style={{ aspectRatio: '4/5', boxShadow: '0 24px 60px rgba(0,0,0,.4)' }}
                        />
                        <div
                            className="absolute rounded-[14px] text-white bottom-4 left-4 md:bottom-[-18px] md:left-[-18px]"
                            style={{
                                background: '#c06a34',
                                padding: '14px 18px',
                                boxShadow: '0 14px 30px rgba(0,0,0,.3)',
                            }}
                        >
                            <b style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: '22px', display: 'block', lineHeight: 1 }}>
                                +15 años
                            </b>
                            <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '.4px' }}>
                                compartiendo mate
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
