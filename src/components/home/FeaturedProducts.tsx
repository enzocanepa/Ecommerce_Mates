import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';
import { useProducts } from '../../context/ProductsContext';

export function FeaturedProducts() {
  const { products } = useProducts();
  const featured = products.slice(0, 3);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl text-center mb-12">
          Productos Destacados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center">
          <Link
            to="/tienda"
            className="inline-flex items-center gap-2 bg-[#c7e47d] text-[#4a5f2f] px-6 py-3 rounded-lg hover:bg-[#b8d66e] transition-colors"
          >
            Ver Todos los Productos
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
