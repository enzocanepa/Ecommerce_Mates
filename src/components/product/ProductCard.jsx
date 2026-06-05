import { useCart } from '../../context/CartContext';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';

export function ProductCard({ product, isFeatured = false }) {
    const { addToCart, openCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.stock === 0) return;
        addToCart(product, 1);
        openCart();
        toast.success(`${product.name} agregado al carrito`, { duration: 2000 });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <article
            className="product-card group bg-white rounded-2xl overflow-hidden flex flex-col"
            style={{ border: '1px solid rgba(34,38,29,.10)' }}
        >
            <Link to={`/producto/${product.id}`} className="flex flex-col flex-1">
                {/* Image */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '1/1', background: '#eceadf' }}>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-card-img w-full h-full object-cover"
                    />
                    {isFeatured && (
                        <span
                            className="absolute top-3.5 left-3.5 text-white text-[11.5px] font-bold tracking-[0.4px] uppercase px-3 py-1.5 rounded-full"
                            style={{ background: '#c06a34', boxShadow: '0 4px 12px rgba(192,106,52,.3)' }}
                        >
                            Más vendido
                        </span>
                    )}
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-[22px]">
                    {product.category && (
                        <p className="text-[11.5px] font-bold tracking-[1.5px] uppercase text-[#566a2f] mb-1.5">
                            {product.category}
                        </p>
                    )}
                    <p className="text-[19px] font-bold leading-[1.25] text-[#22261d] mb-auto">
                        {product.name}
                    </p>

                    <div className="flex items-center justify-between gap-3 mt-[18px]">
                        <div>
                            <span
                                className="text-[27px] leading-none text-[#22261d]"
                                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                            >
                                ${product.price.toLocaleString('es-AR')}
                            </span>
                            <small className="block text-[11.5px] font-semibold text-[#6c7062] tracking-[.3px] mt-1">
                                Envío gratis
                            </small>
                        </div>

                        <button
                            onClick={handleAdd}
                            disabled={product.stock === 0}
                            className="inline-flex items-center gap-2 font-bold text-sm rounded-full transition-all duration-200 active:translate-y-px disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                            style={{
                                background: isAdded ? '#465824' : (product.stock === 0 ? '#9a9d90' : '#566a2f'),
                                color: '#f5f2e6',
                                height: '42px',
                                padding: '0 18px',
                            }}
                            onMouseEnter={e => { if (product.stock > 0 && !isAdded) e.currentTarget.style.background = '#465824'; }}
                            onMouseLeave={e => { if (product.stock > 0 && !isAdded) e.currentTarget.style.background = '#566a2f'; }}
                        >
                            {isAdded ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    Agregado
                                </>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
                                    Agregar
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Link>
        </article>
    );
}
