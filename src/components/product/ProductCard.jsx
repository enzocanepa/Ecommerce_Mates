import { useCart } from '../../context/CartContext';
import { Check, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';

export function ProductCard({ product, isFeatured = false }) {
    const { addToCart } = useCart();
    const [showQty, setShowQty] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [isAdded, setIsAdded] = useState(false);
    const maxStock = product.stock ?? 99;

    const handleAddClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.stock === 0) return;
        setShowQty(true);
    };

    const handleConfirm = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product, quantity);
        setIsAdded(true);
        toast.success(`${product.name} agregado al carrito`, { duration: 2000 });
        setTimeout(() => {
            setIsAdded(false);
            setShowQty(false);
            setQuantity(1);
        }, 2000);
    };

    const handleDecrease = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setQuantity(q => Math.max(1, q - 1));
    };

    const handleIncrease = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setQuantity(q => Math.min(maxStock, q + 1));
    };

    return (
        <article
            className="product-card group bg-white rounded-2xl overflow-hidden flex flex-col"
            style={{ border: '1px solid rgba(34,38,29,.10)' }}
        >
            <Link to={`/producto/${product.id}`} className="flex flex-col flex-1">
                {/* Image */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '4/3', background: '#eceadf' }}>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-card-img w-full h-full object-cover"
                    />
                    {isFeatured && (
                        <span
                            className="absolute top-3.5 left-3.5 text-white text-[11.5px] font-bold tracking-[0.4px] uppercase px-3 py-1.5 rounded-full"
                            style={{
                                background: '#c06a34',
                                boxShadow: '0 4px 12px rgba(192,106,52,.3)',
                            }}
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

                    {/* Meta */}
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

                        {isAdded ? (
                            <span className="inline-flex items-center gap-1.5 px-4 h-[42px] rounded-full bg-[#566a2f] text-[#f5f2e6] text-sm font-bold">
                                <Check className="w-4 h-4" />
                                Agregado
                            </span>
                        ) : showQty ? (
                            <div
                                className="flex items-center gap-1"
                                onClick={e => { e.preventDefault(); e.stopPropagation(); }}
                            >
                                <button
                                    onClick={handleDecrease}
                                    className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 transition-colors"
                                    style={{ borderColor: 'rgba(34,38,29,.18)' }}
                                    aria-label="Disminuir"
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-7 text-center font-bold text-sm">{quantity}</span>
                                <button
                                    onClick={handleIncrease}
                                    disabled={quantity >= maxStock}
                                    className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    style={{ borderColor: 'rgba(34,38,29,.18)' }}
                                    aria-label="Aumentar"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="w-8 h-8 rounded-full bg-[#566a2f] hover:bg-[#465824] flex items-center justify-center transition-colors"
                                    aria-label="Confirmar"
                                >
                                    <Check className="w-4 h-4 text-[#f5f2e6]" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleAddClick}
                                disabled={product.stock === 0}
                                className="inline-flex items-center gap-2 font-bold text-sm rounded-full transition-all duration-200 active:translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{
                                    background: product.stock === 0 ? undefined : '#566a2f',
                                    color: '#f5f2e6',
                                    height: '42px',
                                    padding: '0 18px',
                                }}
                                onMouseEnter={e => { if (product.stock > 0) e.currentTarget.style.background = '#465824'; }}
                                onMouseLeave={e => { if (product.stock > 0) e.currentTarget.style.background = '#566a2f'; }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
                                Agregar
                            </button>
                        )}
                    </div>
                </div>
            </Link>
        </article>
    );
}
