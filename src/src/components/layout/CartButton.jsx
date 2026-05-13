import { Link } from 'react-router';
import { ShoppingCart } from 'lucide-react';
export function CartButton({ totalItems, mobile = false }) {
    if (mobile) {
        return (<Link to="/carrito" className="relative hover:text-green-200 transition-colors">
        <ShoppingCart className="w-5 h-5"/>
        {totalItems > 0 && (<span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
            {totalItems}
          </span>)}
      </Link>);
    }
    return (<Link to="/carrito" className="flex items-center gap-2 bg-[#c7e47d] hover:bg-[#b8d66e] text-[#4a5f2f] px-4 py-2 rounded-lg transition-colors relative">
      <ShoppingCart className="w-5 h-5"/>
      <span>Carrito</span>
      {totalItems > 0 && (<span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
          {totalItems}
        </span>)}
    </Link>);
}
