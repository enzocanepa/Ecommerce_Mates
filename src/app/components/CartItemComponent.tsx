import { CartItem } from '../types';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItemComponentProps {
  item: CartItem;
}

export function CartItemComponent({ item }: CartItemComponentProps) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex gap-4 bg-white p-4 rounded-lg shadow-md">
      <img
        src={item.image}
        alt={item.name}
        className="w-24 h-24 object-cover rounded-md"
      />
      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-600">{item.description}</p>
        <p className="text-[#6b8e3d] font-semibold mt-1">
          ${item.price.toLocaleString('es-AR')}
        </p>
      </div>
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            className="bg-gray-200 hover:bg-gray-300 p-1 rounded transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-semibold w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="bg-gray-200 hover:bg-gray-300 p-1 rounded transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <p className="font-semibold">
          ${(item.price * item.quantity).toLocaleString('es-AR')}
        </p>
      </div>
    </div>
  );
}
