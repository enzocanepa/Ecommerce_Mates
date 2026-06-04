import { usePageSEO } from '../hooks/usePageSEO';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { FeaturedProducts } from '../components/home/FeaturedProducts';

export function Home() {
    usePageSEO({
        title: 'Mates Aconcagua',
        description: 'Tienda online de mates artesanales, bombillas y yerba mate premium. Envío gratis a todo el país.',
    });
    return (
        <div>
            <HeroCarousel />
            <FeaturedProducts />

            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-800">
                                La Tradición del Mate
                            </h2>
                            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                                El mate es más que una bebida, es un ritual que une a familias y amigos.
                                En Mates Aconcagua encontrarás todo lo necesario para mantener viva esta hermosa tradición.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Desde mates artesanales hasta termos de última generación, tenemos todo lo que necesitas.
                            </p>
                        </div>
                        <div className="rounded-2xl overflow-hidden shadow-xl">
                            <img
                                src="/hero-banner.jpg"
                                alt="La tradición del mate"
                                className="w-full h-72 md:h-96 object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
