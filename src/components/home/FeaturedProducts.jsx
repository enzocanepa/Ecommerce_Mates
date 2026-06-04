import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '../product/ProductCard';
import { useProducts } from '../../context/ProductsContext';

export function FeaturedProducts() {
    const { products } = useProducts();
    const featured = products.slice(0, 3);

    return (
        <section className="py-16 md:py-20 bg-[#f5f2ee]">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="inline-block text-[#c07040] text-xs font-semibold tracking-[0.25em] uppercase mb-3">
                        — Lo más elegido
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Productos destacados
                    </h2>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
                        Una selección de nuestras piezas más queridas, listas para acompañarte mate tras mate.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {featured.map((product, index) => (
                        <ProductCard key={product.id} product={product} isFeatured={index === 0} />
                    ))}
                </div>
                <div className="text-center">
                    <Link
                        to="/tienda"
                        className="inline-flex items-center gap-2 border border-gray-400 text-gray-700 px-7 py-3 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                        Ver todos los productos
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
