import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export function CartButton({ totalItems, mobile = false }) {
    const { openCart } = useCart();

    if (mobile) {
        return (
            <button
                onClick={openCart}
                className="relative text-[#22261d] hover:text-[#566a2f] transition-colors"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                aria-label="Abrir carrito"
            >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#c06a34] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                        {totalItems}
                    </span>
                )}
            </button>
        );
    }

    return (
        <button
            onClick={openCart}
            className="inline-flex items-center gap-2 font-bold text-[14.5px] rounded-full h-[42px] px-4 transition-all duration-200 active:translate-y-px relative"
            style={{
                background: '#fff',
                border: '1px solid rgba(34,38,29,.18)',
                color: '#22261d',
                cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#566a2f'; e.currentTarget.style.color = '#566a2f'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(34,38,29,.18)'; e.currentTarget.style.color = '#22261d'; }}
            aria-label="Abrir carrito"
        >
            <ShoppingCart className="w-[17px] h-[17px]" />
            Carrito
            {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#c06a34] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                    {totalItems}
                </span>
            )}
        </button>
    );
}
