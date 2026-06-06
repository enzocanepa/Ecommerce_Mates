import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const serif = "'DM Serif Display', Georgia, serif";
const fmt = n => '$' + n.toLocaleString('es-AR');

export function CartDrawer() {
    const { cart, totalItems, totalPrice, updateQuantity, removeFromCart, isCartOpen, closeCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Bloquear scroll del body cuando el drawer está abierto
    useEffect(() => {
        document.body.style.overflow = isCartOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isCartOpen]);

    // Cerrar con Escape
    useEffect(() => {
        const onKey = e => { if (e.key === 'Escape') closeCart(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [closeCart]);

    const handleCheckout = () => {
        closeCart();
        if (!user) {
            navigate('/login', { state: { from: { pathname: '/checkout' } } });
        } else {
            navigate('/checkout');
        }
    };

    return (
        <>
            {/* Scrim */}
            <div className={`cart-scrim${isCartOpen ? ' open' : ''}`} onClick={closeCart} aria-hidden="true" />

            {/* Drawer */}
            <aside className={`cart-drawer${isCartOpen ? ' open' : ''}`} aria-label="Carrito de compras">

                {/* Header */}
                <div
                    className="flex items-center gap-3 px-6 py-[22px] flex-shrink-0"
                    style={{ background: '#fff', borderBottom: '1px solid rgba(34,38,29,.10)' }}
                >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#22261d', flexShrink: 0 }}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>
                    <h2 className="text-[24px] leading-none flex items-center gap-2.5" style={{ fontFamily: serif, color: '#22261d' }}>
                        Tu carrito
                        {totalItems > 0 && (
                            <span className="text-[13px] font-bold px-2.5 py-0.5 rounded-full" style={{ fontFamily: "'Karla', sans-serif", background: '#eef0e3', color: '#566a2f' }}>
                                {totalItems} {totalItems === 1 ? 'ítem' : 'ítems'}
                            </span>
                        )}
                    </h2>
                    <button
                        onClick={closeCart}
                        className="ml-auto w-[38px] h-[38px] rounded-full flex items-center justify-center transition-all duration-200"
                        style={{ border: '1px solid rgba(34,38,29,.12)', background: '#fff', color: '#6c7062', cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#566a2f'; e.currentTarget.style.color = '#22261d'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(34,38,29,.12)'; e.currentTarget.style.color = '#6c7062'; }}
                        aria-label="Cerrar carrito"
                    >
                        <X className="w-[18px] h-[18px]" />
                    </button>
                </div>

                {/* Shipping bar */}
                {totalItems > 0 && (
                    <div
                        className="flex items-center gap-2.5 px-6 py-3.5 text-[13.5px] font-semibold flex-shrink-0"
                        style={{ background: '#eef0e3', borderBottom: '1px solid rgba(34,38,29,.10)', color: '#465824' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: '#566a2f' }}><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/></svg>
                        <span>¡Tu pedido tiene <b>envío gratis</b> a todo el país!</span>
                    </div>
                )}

                {/* Items or empty state */}
                {cart.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-2">
                        <span
                            className="w-[84px] h-[84px] rounded-[24px] grid place-items-center mb-2.5"
                            style={{ background: '#eef0e3', color: '#566a2f' }}
                        >
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                        </span>
                        <h3 className="text-[24px]" style={{ fontFamily: serif, color: '#22261d' }}>
                            Tu carrito está vacío
                        </h3>
                        <p className="text-[14.5px]" style={{ color: '#6c7062', maxWidth: '240px' }}>
                            Descubrí nuestros mates artesanales y empezá tu ronda.
                        </p>
                        <Link
                            to="/tienda"
                            onClick={closeCart}
                            className="inline-flex items-center justify-center font-bold text-[14.5px] rounded-full transition-all duration-200 active:translate-y-px mt-3.5"
                            style={{ height: '46px', padding: '0 24px', background: '#566a2f', color: '#f5f2e6' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#465824'}
                            onMouseLeave={e => e.currentTarget.style.background = '#566a2f'}
                        >
                            Ir a la tienda
                        </Link>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto px-6" style={{ overscrollBehavior: 'contain' }}>
                        {cart.map(item => (
                            <div
                                key={item.id}
                                className="flex gap-3.5 py-[18px]"
                                style={{ borderBottom: '1px solid rgba(34,38,29,.10)' }}
                            >
                                {/* Thumbnail */}
                                <div
                                    className="w-[78px] h-[78px] rounded-[12px] overflow-hidden flex-shrink-0"
                                    style={{ background: '#eceadf', border: '1px solid rgba(34,38,29,.10)' }}
                                >
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0 flex flex-col">
                                    <p className="text-[15px] font-bold leading-[1.3]" style={{ color: '#22261d' }}>
                                        {item.name}
                                    </p>
                                    <p className="text-[12.5px] mt-0.5" style={{ color: '#6c7062' }}>
                                        {item.category}
                                    </p>
                                    <p className="text-[13px] font-semibold mt-auto" style={{ color: '#566a2f' }}>
                                        {fmt(item.price)} c/u
                                    </p>
                                </div>

                                {/* Right: remove + stepper + line total */}
                                <div className="flex flex-col items-end justify-between flex-shrink-0">
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="transition-colors"
                                        style={{ background: 'none', border: 'none', color: '#b9bcb0', cursor: 'pointer', padding: '2px' }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#c0392b'}
                                        onMouseLeave={e => e.currentTarget.style.color = '#b9bcb0'}
                                        aria-label="Quitar producto"
                                    >
                                        <Trash2 className="w-[18px] h-[18px]" />
                                    </button>

                                    {/* Stepper */}
                                    <div
                                        className="flex items-center overflow-hidden"
                                        style={{ border: '1.5px solid rgba(34,38,29,.15)', borderRadius: '9px', background: '#fff' }}
                                    >
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="w-[30px] h-[32px] flex items-center justify-center transition-colors"
                                            style={{ background: 'none', border: 'none', color: '#22261d', cursor: 'pointer' }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#eef0e3'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                        >
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <input
                                            type="number"
                                            min="1"
                                            max={item.stock ?? 99}
                                            value={item.quantity}
                                            onChange={e => {
                                                const val = parseInt(e.target.value, 10);
                                                if (!isNaN(val) && val >= 1) updateQuantity(item.id, Math.min(val, item.stock ?? 99));
                                            }}
                                            className="text-center text-[14px] font-bold"
                                            style={{ width: '36px', border: 'none', outline: 'none', background: 'none', color: '#22261d', fontFamily: "'Karla', sans-serif" }}
                                        />
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="w-[30px] h-[32px] flex items-center justify-center transition-colors"
                                            style={{ background: 'none', border: 'none', color: '#22261d', cursor: item.quantity >= (item.stock ?? 99) ? 'not-allowed' : 'pointer', opacity: item.quantity >= (item.stock ?? 99) ? 0.4 : 1 }}
                                            disabled={item.quantity >= (item.stock ?? 99)}
                                            onMouseEnter={e => { if (item.quantity < (item.stock ?? 99)) e.currentTarget.style.background = '#eef0e3'; }}
                                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {/* Line total */}
                                    <p className="text-[17px] whitespace-nowrap font-bold" style={{ fontFamily: "'Karla', sans-serif", color: '#22261d' }}>
                                        {fmt(item.price * item.quantity)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer */}
                {cart.length > 0 && (
                    <div
                        className="flex-shrink-0 px-6 pt-5 pb-[22px]"
                        style={{ background: '#fff', borderTop: '1px solid rgba(34,38,29,.10)' }}
                    >
                        <div className="flex justify-between items-center text-[14.5px] mb-2">
                            <span style={{ color: '#6c7062' }}>Subtotal</span>
                            <span style={{ color: '#22261d', fontWeight: 600 }}>{fmt(totalPrice)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[14.5px] mb-3">
                            <span style={{ color: '#6c7062' }}>Envío</span>
                            <span className="font-bold" style={{ color: '#566a2f' }}>Gratis</span>
                        </div>

                        <div
                            className="flex justify-between items-baseline mb-4 pt-3"
                            style={{ borderTop: '1px solid rgba(34,38,29,.10)' }}
                        >
                            <span className="text-[16px] font-bold" style={{ color: '#22261d' }}>Total</span>
                            <span className="text-[30px]" style={{ fontFamily: serif, color: '#22261d' }}>
                                {fmt(totalPrice)}
                            </span>
                        </div>

                        {/* Checkout button */}
                        <button
                            onClick={handleCheckout}
                            className="w-full flex items-center justify-center gap-2.5 font-bold text-[16px] transition-all duration-200 active:translate-y-px"
                            style={{
                                height: '54px',
                                borderRadius: '13px',
                                background: '#c06a34',
                                color: '#fff',
                                border: 'none',
                                boxShadow: '0 8px 22px rgba(192,106,52,.30)',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#ab5b2a'}
                            onMouseLeave={e => e.currentTarget.style.background = '#c06a34'}
                        >
                            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>
                            Finalizar compra
                        </button>

                        {/* Keep shopping */}
                        <button
                            onClick={closeCart}
                            className="w-full font-bold text-[14.5px] transition-all duration-200 mt-2.5"
                            style={{
                                height: '46px',
                                borderRadius: '10px',
                                background: 'none',
                                border: 'none',
                                color: '#566a2f',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#eef0e3'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                            Seguir comprando
                        </button>

                        {/* Security note */}
                        <div className="flex items-center justify-center gap-1.5 mt-3 text-[12.5px]" style={{ color: '#6c7062' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            Pago 100% seguro · Devoluciones hasta 30 días
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
}
