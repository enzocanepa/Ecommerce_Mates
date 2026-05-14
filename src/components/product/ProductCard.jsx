import { useCart } from '../../context/CartContext';
import { ShoppingCart, Check, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';

export function ProductCard({ product }) {
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <Link to={`/producto/${product.id}`} className="block">
                <div className="aspect-square overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"/>
                </div>
                <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 hover:text-[#a8c95f] transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl text-[#6b8e3d]">
                            ${product.price.toLocaleString('es-AR')}
                        </span>

                        {isAdded ? (
                            <span className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8fb84d] text-white text-sm">
                                <Check className="w-4 h-4"/>
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
                                    <Minus className="w-3 h-3"/>
                                </button>
                                <span className="w-7 text-center font-semibold text-sm">{quantity}</span>
                                <button
                                    onClick={handleIncrease}
                                    disabled={quantity >= maxStock}
                                    className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Aumentar"
                                >
                                    <Plus className="w-3 h-3"/>
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="w-8 h-8 rounded-lg bg-[#c7e47d] hover:bg-[#b8d66e] flex items-center justify-center transition-colors"
                                    aria-label="Confirmar"
                                >
                                    <Check className="w-4 h-4 text-[#4a5f2f]"/>
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleAddClick}
                                disabled={product.stock === 0}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#c7e47d] hover:bg-[#b8d66e] text-[#4a5f2f] transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-sm"
                            >
                                <ShoppingCart className="w-4 h-4"/>
                                Agregar
                            </button>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    );
}
