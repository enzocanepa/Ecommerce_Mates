import { useCart } from '../../context/CartContext';
import { ShoppingCart, Check, Plus, Minus } from 'lucide-react';
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
        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100">
            <Link to={`/producto/${product.id}`} className="block">
                <div className="relative aspect-square overflow-hidden">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {isFeatured && (
                        <span className="absolute top-3 left-3 bg-[#c07040] text-white text-xs font-semibold px-2.5 py-1 rounded-md uppercase tracking-wide">
                            Más vendido
                        </span>
                    )}
                </div>
                <div className="p-4">
                    {product.category && (
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                            {product.category}
                        </p>
                    )}
                    <h3 className="font-semibold text-gray-900 text-base mb-3 hover:text-[#c07040] transition-colors leading-snug">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xl font-bold text-gray-900">
                                ${product.price.toLocaleString('es-AR')}
                            </span>
                            <p className="text-xs text-[#4a5f2f] mt-0.5">Envío gratis</p>
                        </div>

                        {isAdded ? (
                            <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8fb84d] text-white text-sm">
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
                                    className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                    aria-label="Disminuir"
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-7 text-center font-semibold text-sm">{quantity}</span>
                                <button
                                    onClick={handleIncrease}
                                    disabled={quantity >= maxStock}
                                    className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Aumentar"
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="w-8 h-8 rounded-lg bg-[#c7e47d] hover:bg-[#b8d66e] flex items-center justify-center transition-colors"
                                    aria-label="Confirmar"
                                >
                                    <Check className="w-4 h-4 text-[#4a5f2f]" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleAddClick}
                                disabled={product.stock === 0}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#4a5f2f] hover:bg-[#3a4f20] text-white transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-sm"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Agregar
                            </button>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}
