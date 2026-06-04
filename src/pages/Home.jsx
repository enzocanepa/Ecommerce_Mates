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

            <section className="py-16 md:py-24 bg-[#1e2d10]">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                        <div>
                            <span className="inline-block text-[#c07040] text-xs font-semibold tracking-[0.25em] uppercase mb-4">
                                — Nuestra Esencia
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-snug">
                                La tradición del mate
                            </h2>
                            <p className="text-white/70 mb-4 leading-relaxed">
                                El mate es más que una bebida: es un ritual que une a familias y amigos. En Mates Aconcagua encontrás todo lo necesario para mantener viva esta hermosa costumbre.
                            </p>
                            <p className="text-white/70 mb-8 leading-relaxed">
                                Desde mates artesanales curados a mano hasta termos de última generación, seleccionamos cada pieza para que el ritual te acompañe durante años.
                            </p>
                            <p className="text-[#c07040] italic font-medium text-base">
                                — Hecho con manos argentinas
                            </p>
                        </div>
                        <div className="relative">
                            <div className="rounded-2xl overflow-hidden shadow-2xl">
                                <img
                                    src="/hero-home.png"
                                    alt="La tradición del mate"
                                    className="w-full h-80 md:h-[420px] object-cover"
                                />
                            </div>
                            <div className="absolute bottom-5 left-5 bg-[#c07040] text-white px-4 py-2.5 rounded-xl text-sm font-bold leading-tight">
                                +15 años
                                <br />
                                <span className="font-normal text-xs">compartiendo mate</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
