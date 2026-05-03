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

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl mb-6">
              La Tradición del Mate
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              El mate es más que una bebida, es un ritual que une a familias y amigos.
              En Mate Shop encontrarás todo lo necesario para mantener viva esta hermosa tradición.
            </p>
            <p className="text-lg text-gray-700">
              Desde mates artesanales hasta termos de última generación, tenemos todo lo que necesitas.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
