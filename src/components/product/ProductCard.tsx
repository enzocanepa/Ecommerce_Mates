import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, cart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const isInCart = cart.some(item => item.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    toast.success(`${product.name} agregado al carrito`, { duration: 2000 });
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <Link to={`/producto/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
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
            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isAdded
                  ? 'bg-[#8fb84d] text-white'
                  : 'bg-[#c7e47d] hover:bg-[#b8d66e] text-[#4a5f2f]'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  Agregado
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Agregar
                </>
              )}
            </button>
          </div>
          {isInCart && !isAdded && (
            <p className="text-xs text-[#6b8e3d] mt-2">Ya está en tu carrito</p>
          )}
        </div>
      </Link>
    </div>
  );
}
