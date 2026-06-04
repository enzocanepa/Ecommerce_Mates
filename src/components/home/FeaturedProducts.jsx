import { Link } from 'react-router';
import { ProductCard } from '../product/ProductCard';
import { useProducts } from '../../context/ProductsContext';

export function FeaturedProducts() {
    const { products } = useProducts();
    const featured = products.slice(0, 3);

    return (
        <section className="py-16 md:py-[88px]" style={{ background: '#f6f4ec' }}>
            <div className="max-w-[1200px] mx-auto px-6 md:px-7">

                {/* Section header */}
                <div className="text-center max-w-[620px] mx-auto mb-10 md:mb-[52px]">
                    <span className="inline-flex items-center gap-2.5 text-[#c06a34] text-[11px] md:text-[12.5px] font-bold tracking-[2.5px] uppercase mb-3 md:mb-[14px]">
                        <span className="inline-block w-5 md:w-6 h-px bg-[#c06a34]" />
                        Lo más elegido
                    </span>
                    <h2
                        className="text-[30px] md:text-[38px] lg:text-[44px] leading-[1.1] tracking-[-0.3px] mb-3 text-[#22261d]"
                        style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                    >
                        Productos destacados
                    </h2>
                    <p className="text-[14.5px] md:text-[16.5px] text-[#6c7062]">
                        Una selección de nuestras piezas más queridas, listas para acompañarte mate tras mate.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-[26px]">
                    {featured.map((product, index) => (
                        <ProductCard key={product.id} product={product} isFeatured={index === 0} />
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center mt-10 md:mt-12">
                    <Link
                        to="/tienda"
                        className="inline-flex items-center gap-2 font-bold text-sm md:text-[15.5px] rounded-full transition-all duration-200 active:translate-y-px"
                        style={{
                            background: '#fff',
                            border: '1px solid rgba(34,38,29,.18)',
                            color: '#22261d',
                            height: '46px',
                            padding: '0 22px',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#566a2f'; e.currentTarget.style.color = '#566a2f'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(34,38,29,.18)'; e.currentTarget.style.color = '#22261d'; }}
                    >
                        Ver todos los productos
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
