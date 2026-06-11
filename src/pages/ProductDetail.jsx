import { useParams, useNavigate, Link, useLocation } from 'react-router';
import { useProducts } from '../context/ProductsContext';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { usePageSEO } from '../hooks/usePageSEO';
import { ProductCard } from '../components/product/ProductCard';
import { Check, ArrowLeft, ChevronLeft, ChevronRight, Package, Shield, Truck, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

const serif = "'DM Serif Display', Georgia, serif";

export function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

    const { products } = useProducts();
    const { addToCart, openCart } = useCart();

    const [isAdded, setIsAdded]               = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedVariant, setSelectedVariant]     = useState('');
    const [quantity, setQuantity]                   = useState(1);
    const [descExpanded, setDescExpanded]           = useState(false);

    const product = products.find(p => p.id === Number(id));

    usePageSEO({
        title: product?.name ?? 'Producto',
        description: product?.description,
    });

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#f6f4ec' }}>
                <div className="text-center">
                    <h2 className="text-[32px] mb-4" style={{ fontFamily: serif }}>Producto no encontrado</h2>
                    <Link to="/tienda" className="font-bold" style={{ color: '#566a2f' }}>
                        Volver al catálogo
                    </Link>
                </div>
            </div>
        );
    }

    const productImages = (product.images?.length ? product.images : [{ url: product.image }])
        .filter(img => (typeof img === 'string' ? img : img.url));

    const productImagesWithMeta = productImages.map(img =>
        typeof img === 'string' ? { url: img, variantName: null } : { url: img.url, variantName: img.variantName ?? null }
    );
    const maxStock = product.stock ?? 99;

    const handleAddToCart = () => {
        if (product.stock === 0) return;
        addToCart(product, quantity);
        openCart();
        const label = quantity > 1 ? `${quantity} unidades agregadas` : '¡Agregado al carrito!';
        toast.success(label, { description: product.name, duration: 2500 });
        setIsAdded(true);
        setTimeout(() => { setIsAdded(false); setQuantity(1); }, 2500);
    };

    const setQty = (val) => {
        const n = parseInt(val, 10);
        if (!isNaN(n) && n >= 1) setQuantity(Math.min(n, maxStock));
    };

    const relatedProducts = products
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    return (
        <div style={{ background: '#f6f4ec', minHeight: '100vh' }}>

            <div className="max-w-[1200px] mx-auto px-6 md:px-7 py-6 md:py-8">

                {/* Breadcrumb + back */}
                <nav className="flex items-center gap-2 text-[13.5px] mb-8 flex-wrap" style={{ color: '#6c7062' }}>
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-1.5 font-semibold transition-colors"
                        style={{ background: 'none', border: 'none', color: '#566a2f', cursor: 'pointer', padding: 0 }}
                        onMouseEnter={e => e.currentTarget.style.color = '#465824'}
                        onMouseLeave={e => e.currentTarget.style.color = '#566a2f'}
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Volver
                    </button>
                    <span style={{ color: '#c4bfb0' }}>·</span>
                    <Link to="/tienda"
                        onMouseEnter={e => e.currentTarget.style.color = '#566a2f'}
                        onMouseLeave={e => e.currentTarget.style.color = '#6c7062'}
                        style={{ color: '#6c7062' }}
                    >Catálogo</Link>
                    {product.category && (<>
                        <span style={{ color: '#c4bfb0' }}>·</span>
                        <span style={{ color: '#6c7062' }}>{product.category}</span>
                    </>)}
                    <span style={{ color: '#c4bfb0' }}>·</span>
                    <span className="font-semibold truncate max-w-[200px]" style={{ color: '#22261d' }}>{product.name}</span>
                </nav>

                {/* Main card */}
                <div
                    className="rounded-3xl overflow-hidden mb-12"
                    style={{ background: '#fff', border: '1px solid rgba(34,38,29,.10)' }}
                >
                    <div className="grid md:grid-cols-2 gap-0">

                        {/* ── Image gallery ─────────────────────── */}
                        <div className="md:p-8" style={{ borderRight: '1px solid rgba(34,38,29,.08)' }}>
                            <div
                                className="relative md:rounded-2xl overflow-hidden mb-0 md:mb-4"
                                style={{ aspectRatio: '1/1', background: '#eceadf' }}
                            >
                                <img
                                    src={productImagesWithMeta[currentImageIndex]?.url}
                                    alt={`${product.name} - imagen ${currentImageIndex + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                {productImagesWithMeta.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setCurrentImageIndex(i => (i - 1 + productImagesWithMeta.length) % productImagesWithMeta.length)}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all"
                                            style={{ background: 'rgba(255,255,255,.85)', border: 'none', cursor: 'pointer' }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#fff'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.85)'}
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setCurrentImageIndex(i => (i + 1) % productImagesWithMeta.length)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all"
                                            style={{ background: 'rgba(255,255,255,.85)', border: 'none', cursor: 'pointer' }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#fff'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.85)'}
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {productImagesWithMeta.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-1 px-4 pt-3 md:px-0 md:pt-0">
                                    {productImagesWithMeta.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className="flex-shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden transition-all"
                                            style={{
                                                border: `2px solid ${currentImageIndex === index ? '#566a2f' : 'rgba(34,38,29,.12)'}`,
                                                background: 'none', padding: 0, cursor: 'pointer',
                                            }}
                                        >
                                            <img src={img.url} alt={img.variantName ?? `Miniatura ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ── Product info ───────────────────────── */}
                        <div className="p-5 md:p-8 flex flex-col">

                            {/* Category + title */}
                            <div className="mb-5">
                                {product.category && (
                                    <span
                                        className="inline-block text-[11.5px] font-bold tracking-[1.5px] uppercase px-3 py-1.5 rounded-full mb-3"
                                        style={{ background: '#eef0e3', color: '#566a2f' }}
                                    >
                                        {product.category}
                                    </span>
                                )}
                                <h1
                                    className="text-[28px] md:text-[34px] leading-[1.1] tracking-[-0.3px] mb-4"
                                    style={{ fontFamily: serif, color: '#22261d' }}
                                >
                                    {product.name}
                                </h1>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-[38px] leading-none font-bold" style={{ fontFamily: "'Karla', sans-serif", color: '#22261d' }}>
                                        ${product.price.toLocaleString('es-AR')}
                                    </span>
                                    <span className="text-[13px] font-semibold" style={{ color: '#566a2f' }}>Envío gratis</span>
                                </div>
                            </div>

                            {/* Stock */}
                            {product.stock !== undefined && (
                                <p className="text-[13.5px] font-semibold mb-5" style={{ color: product.stock > 0 ? '#566a2f' : '#b91c1c' }}>
                                    {product.stock > 0 ? `${product.stock} unidades disponibles` : 'Sin stock'}
                                </p>
                            )}

                            {/* Variants */}
                            {product.variants?.length > 0 && (
                                <div className="mb-6">
                                    <p className="text-[13px] font-bold tracking-[1px] uppercase mb-3" style={{ color: '#6c7062' }}>
                                        Variante
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.variants.map(v => {
                                            const label = typeof v === 'string' ? v : v.name;
                                            const active = selectedVariant === label;
                                            return (
                                                <button
                                                    key={label}
                                                    onClick={() => {
                                                        setSelectedVariant(label);
                                                        const imgIdx = productImagesWithMeta.findIndex(img => img.variantName === label);
                                                        if (imgIdx !== -1) setCurrentImageIndex(imgIdx);
                                                    }}
                                                    className="text-[13.5px] font-semibold transition-all duration-200"
                                                    style={{
                                                        height: '38px', padding: '0 16px',
                                                        borderRadius: '20px',
                                                        border: `1.5px solid ${active ? '#566a2f' : 'rgba(34,38,29,.18)'}`,
                                                        background: active ? '#eef0e3' : '#fff',
                                                        color: active ? '#465824' : '#3f443a',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    {label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            {(product.description || product.fullDescription) && (
                                <div className="mb-7">
                                    <p className="text-[13px] font-bold tracking-[1px] uppercase mb-2" style={{ color: '#6c7062' }}>
                                        Descripción
                                    </p>
                                    {/* Mobile: short desc + leer más */}
                                    <div className="md:hidden">
                                        <p className="text-[15px] leading-[1.7]" style={{ color: '#3f443a' }}>
                                            {product.description}
                                        </p>
                                        {product.fullDescription && product.fullDescription !== product.description && (
                                            <>
                                                {descExpanded && (
                                                    <p className="text-[15px] leading-[1.7] mt-2" style={{ color: '#3f443a' }}>
                                                        {product.fullDescription}
                                                    </p>
                                                )}
                                                <button
                                                    onClick={() => setDescExpanded(v => !v)}
                                                    className="text-[13.5px] font-bold mt-2 transition-colors"
                                                    style={{ background: 'none', border: 'none', color: '#566a2f', cursor: 'pointer', padding: 0 }}
                                                    onMouseEnter={e => e.currentTarget.style.color = '#465824'}
                                                    onMouseLeave={e => e.currentTarget.style.color = '#566a2f'}
                                                >
                                                    {descExpanded ? 'Leer menos ↑' : 'Leer más ↓'}
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    {/* Desktop: full description always visible */}
                                    <p className="hidden md:block text-[15px] leading-[1.7]" style={{ color: '#3f443a' }}>
                                        {product.fullDescription || product.description}
                                    </p>
                                </div>
                            )}

                            {/* Quantity + Add to cart */}
                            <div className="mt-auto">
                                <p className="text-[13px] font-bold tracking-[1px] uppercase mb-3" style={{ color: '#6c7062' }}>
                                    Cantidad
                                </p>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                                    {/* Stepper */}
                                    <div
                                        className="flex items-center overflow-hidden self-start sm:flex-shrink-0"
                                        style={{ border: '1.5px solid rgba(34,38,29,.18)', borderRadius: '12px', background: '#f6f4ec' }}
                                    >
                                        <button
                                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                            disabled={quantity <= 1}
                                            className="w-[44px] h-[48px] flex items-center justify-center transition-colors disabled:opacity-30"
                                            style={{ background: 'none', border: 'none', cursor: quantity <= 1 ? 'not-allowed' : 'pointer', color: '#22261d' }}
                                            onMouseEnter={e => { if (quantity > 1) e.currentTarget.style.background = '#eef0e3'; }}
                                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            max={maxStock}
                                            value={quantity}
                                            onChange={e => setQty(e.target.value)}
                                            className="text-center text-[16px] font-bold"
                                            style={{ width: '52px', border: 'none', outline: 'none', background: 'none', color: '#22261d', fontFamily: "'Karla', sans-serif" }}
                                        />
                                        <button
                                            onClick={() => setQuantity(q => Math.min(maxStock, q + 1))}
                                            disabled={quantity >= maxStock}
                                            className="w-[44px] h-[48px] flex items-center justify-center transition-colors disabled:opacity-30"
                                            style={{ background: 'none', border: 'none', cursor: quantity >= maxStock ? 'not-allowed' : 'pointer', color: '#22261d' }}
                                            onMouseEnter={e => { if (quantity < maxStock) e.currentTarget.style.background = '#eef0e3'; }}
                                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Add button */}
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={product.stock === 0}
                                        className="w-full sm:flex-1 flex items-center justify-center gap-2.5 font-bold text-[16px] transition-all duration-200 active:translate-y-px disabled:opacity-40 disabled:cursor-not-allowed"
                                        style={{
                                            height: '52px',
                                            borderRadius: '13px',
                                            background: isAdded ? '#465824' : '#566a2f',
                                            color: '#f5f2e6',
                                            border: 'none',
                                            cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                                        }}
                                        onMouseEnter={e => { if (product.stock > 0 && !isAdded) e.currentTarget.style.background = '#465824'; }}
                                        onMouseLeave={e => { if (product.stock > 0 && !isAdded) e.currentTarget.style.background = '#566a2f'; }}
                                    >
                                        {isAdded ? (
                                            <>
                                                <Check className="w-5 h-5" />
                                                ¡Agregado!
                                            </>
                                        ) : (
                                            <>
                                                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
                                                Agregar al carrito
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Features */}
                                <div className="flex flex-col gap-3 pt-5" style={{ borderTop: '1px solid rgba(34,38,29,.10)' }}>
                                    {[
                                        { Icon: Truck,   title: 'Envío a todo el país',   desc: 'Recibí tu pedido en 3-7 días hábiles' },
                                        { Icon: Shield,  title: 'Compra protegida',        desc: 'Garantía de calidad en todos nuestros productos' },
                                        { Icon: Package, title: 'Embalaje seguro',         desc: 'Tu pedido llega perfectamente protegido' },
                                    ].map(({ Icon, title, desc }) => (
                                        <div key={title} className="flex items-start gap-3 text-[13.5px]">
                                            <Icon className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" style={{ color: '#566a2f' }} />
                                            <div>
                                                <p className="font-bold" style={{ color: '#22261d' }}>{title}</p>
                                                <p style={{ color: '#6c7062' }}>{desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-14">
                        <div className="mb-7">
                            <p className="text-[12px] font-bold tracking-[2.5px] uppercase mb-2" style={{ color: '#c06a34' }}>
                                También te puede gustar
                            </p>
                            <h2 className="text-[28px] md:text-[34px]" style={{ fontFamily: serif, color: '#22261d' }}>
                                Productos relacionados
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
