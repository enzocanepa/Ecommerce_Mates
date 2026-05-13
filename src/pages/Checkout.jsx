import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getBaseUrl } from '../services/api';
import { ShoppingBag, MapPin, User, Phone, Mail, ChevronRight } from 'lucide-react';
const BASE_URL = getBaseUrl();
const INITIAL_FORM = {
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
};
const PROVINCES = [
    'Buenos Aires', 'CABA', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
    'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja',
    'Mendoza', 'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan',
    'San Luis', 'Santa Cruz', 'Santa Fe', 'Santiago del Estero',
    'Tierra del Fuego', 'Tucumán',
];
function Field({ label, field, type = 'text', placeholder, icon: Icon, form, errors, onChange }) {
    return (<div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        {Icon && (<Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>)}
        <input type={type} value={form[field]} onChange={(e) => onChange(field, e.target.value)} placeholder={placeholder} className={`w-full border rounded-lg py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#a8c95f] ${Icon ? 'pl-9 pr-3' : 'px-3'} ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}/>
      </div>
      {errors[field] && (<p className="text-red-500 text-xs mt-1">{errors[field]}</p>)}
    </div>);
}
// ─────────────────────────────────────────────────────────────────────────────
export function Checkout() {
    const { cart, totalPrice } = useCart();
    const { user, accessToken } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        ...INITIAL_FORM,
        name: user?.name ?? '',
        email: user?.email ?? '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    if (cart.length === 0) {
        return (<div className="py-20 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-4"/>
          <h2 className="text-2xl mb-3">Tu carrito está vacío</h2>
          <Link to="/tienda" className="text-[#6b8e3d] hover:text-[#a8c95f] underline">
            Volver a la tienda
          </Link>
        </div>
      </div>);
    }
    function validate() {
        const e = {};
        if (!form.name.trim())
            e.name = 'Requerido';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
            e.email = 'Email inválido';
        if (!form.phone.trim())
            e.phone = 'Requerido';
        if (!form.street.trim())
            e.street = 'Requerido';
        if (!form.city.trim())
            e.city = 'Requerido';
        if (!form.province)
            e.province = 'Requerido';
        if (!form.postalCode.trim())
            e.postalCode = 'Requerido';
        setErrors(e);
        return Object.keys(e).length === 0;
    }
    function handleChange(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field])
            setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    async function handlePayment() {
        if (!validate())
            return;
        setLoading(true);
        setApiError('');
        // Save cart before any redirect
        sessionStorage.setItem('checkoutCart', JSON.stringify(cart));
        sessionStorage.setItem('checkoutTotal', String(totalPrice));
        try {
            const res = await fetch(`${BASE_URL}/api/checkout/create-preference`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken ?? ''}`,
                },
                body: JSON.stringify({
                    items: cart,
                    total: totalPrice,
                    payer: { name: form.name, email: form.email, phone: form.phone },
                    shipping: {
                        street: form.street,
                        city: form.city,
                        province: form.province,
                        postalCode: form.postalCode,
                    },
                    baseUrl: window.location.origin,
                }),
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.error || 'Error al crear la preferencia de pago');
            window.location.href = data.init_point;
        }
        catch (err) {
            const isNetwork = err instanceof TypeError || err.message === 'Failed to fetch';
            if (isNetwork) {
                // MP / Edge Function not configured → simulate checkout for testing
                navigate('/checkout/exito?simulated=true');
                return;
            }
            setApiError(err.message);
        }
        finally {
            setLoading(false);
        }
    }
    return (<div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/carrito" className="hover:text-gray-700 transition-colors">Carrito</Link>
          <ChevronRight className="w-4 h-4"/>
          <span className="text-gray-800 font-medium">Checkout</span>
        </nav>

        <h1 className="text-3xl font-semibold text-gray-800 mb-8">Finalizar Compra</h1>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* ── Shipping form (3/5) ────────────────────── */}
          <div className="lg:col-span-3 space-y-6">
            {/* Contact */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-[#a8c95f]"/>
                Datos de contacto
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nombre completo" field="name" placeholder="Juan Pérez" icon={User} form={form} errors={errors} onChange={handleChange}/>
                <Field label="Email" field="email" type="email" placeholder="juan@ejemplo.com" icon={Mail} form={form} errors={errors} onChange={handleChange}/>
                <Field label="Teléfono" field="phone" type="tel" placeholder="+54 9 11 1234-5678" icon={Phone} form={form} errors={errors} onChange={handleChange}/>
              </div>
            </div>

            {/* Shipping address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#a8c95f]"/>
                Dirección de envío
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field label="Calle y número" field="street" placeholder="Av. Corrientes 1234" form={form} errors={errors} onChange={handleChange}/>
                </div>
                <Field label="Ciudad" field="city" placeholder="Buenos Aires" form={form} errors={errors} onChange={handleChange}/>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
                  <select value={form.province} onChange={(e) => handleChange('province', e.target.value)} className={`w-full border rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#a8c95f] ${errors.province ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
                    <option value="">Seleccionar provincia</option>
                    {PROVINCES.map((p) => (<option key={p} value={p}>{p}</option>))}
                  </select>
                  {errors.province && (<p className="text-red-500 text-xs mt-1">{errors.province}</p>)}
                </div>
                <Field label="Código postal" field="postalCode" placeholder="1000" form={form} errors={errors} onChange={handleChange}/>
              </div>
            </div>
          </div>

          {/* ── Order summary (2/5) ───────────────────── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Resumen del pedido</h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-1">
                {cart.map((item) => (<div key={item.id} className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0" onError={(e) => { e.target.src = 'https://placehold.co/48'; }}/>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 flex-shrink-0">
                      ${(item.price * item.quantity).toLocaleString('es-AR')}
                    </span>
                  </div>))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>${totalPrice.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-sm text-[#6b8e3d]">
                  <span>Envío</span>
                  <span className="font-medium">Gratis</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-800 border-t border-gray-100 pt-3">
                  <span>Total</span>
                  <span>${totalPrice.toLocaleString('es-AR')}</span>
                </div>
              </div>

              {apiError && (<div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {apiError}
                </div>)}

              {/* Mercado Pago button */}
              <button onClick={handlePayment} disabled={loading} className="mt-5 w-full flex items-center justify-center gap-3 bg-[#009ee3] hover:bg-[#0082c0] text-white py-3.5 rounded-xl font-semibold text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? (<span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                    Procesando...
                  </span>) : (<>
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.23c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.88 14.48l-2.98-.924c-.642-.204-.657-.645.136-.953l11.642-4.489c.537-.194 1.006.131.884.134z"/>
                    </svg>
                    Pagar con Mercado Pago
                  </>)}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Serás redirigido al sitio seguro de Mercado Pago
              </p>

              <Link to="/carrito" className="block text-center mt-3 text-sm text-[#6b8e3d] hover:text-[#4a5f2f] transition-colors">
                ← Volver al carrito
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
