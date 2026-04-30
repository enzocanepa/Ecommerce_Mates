import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CartItemComponent } from '../components/CartItemComponent';
import { Link, useNavigate } from 'react-router';
import { ShoppingBag, Trash2, CreditCard } from 'lucide-react';
import { useState } from 'react';

export function Cart() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [, setError] = useState('');

  const handleCheckout = () => {
    setError('');
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="py-20 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h2 className="text-3xl mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-8">
            ¡Descubre nuestros productos y comienza a comprar!
          </p>
          <Link
            to="/tienda"
            className="inline-block bg-[#c7e47d] text-[#4a5f2f] px-8 py-3 rounded-lg hover:bg-[#b8d66e] transition-colors"
          >
            Ir a la Tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-5xl">
            Carrito de Compras
          </h1>
          <button
            onClick={clearCart}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Vaciar carrito
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <CartItemComponent key={item.id} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <h2 className="text-2xl mb-6">Resumen del Pedido</h2>
              
              <div className="space-y-3 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-semibold">
                      ${(item.price * item.quantity).toLocaleString('es-AR')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg mb-2">
                  <span>Subtotal:</span>
                  <span className="font-semibold">
                    ${totalPrice.toLocaleString('es-AR')}
                  </span>
                </div>
                <div className="flex justify-between text-lg text-[#b8d66e]">
                  <span>Envío:</span>
                  <span className="font-semibold">Gratis</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-2xl">
                  <span>Total:</span>
                  <span className="font-semibold text-[#6b8e3d]">
                    ${totalPrice.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>

              {!user && (
                <div className="bg-blue-50 text-blue-700 p-3 rounded-lg text-sm mb-4">
                  Debes iniciar sesión para finalizar la compra
                </div>
              )}

              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 bg-[#c7e47d] text-[#4a5f2f] py-3 rounded-lg hover:bg-[#b8d66e] transition-colors text-lg font-semibold"
              >
                <CreditCard className="w-5 h-5" />
                Finalizar Compra
              </button>

              <Link
                to="/tienda"
                className="block text-center mt-4 text-[#6b8e3d] hover:text-[#a8c95f] transition-colors"
              >
                Seguir Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}