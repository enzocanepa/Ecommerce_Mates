import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getBaseUrl } from '../services/api';
import { Check, ShoppingBag, MapPin, User, Phone, Mail, Truck, Package, RotateCcw, Lock } from 'lucide-react';

const serif = "'DM Serif Display', Georgia, serif";
const BASE_URL = getBaseUrl();

const INITIAL_FORM = {
    name: '', email: '', phone: '',
    street: '', city: '', province: '', postalCode: '',
};

const PROVINCES = [
    'Buenos Aires','CABA','Catamarca','Chaco','Chubut','Córdoba',
    'Corrientes','Entre Ríos','Formosa','Jujuy','La Pampa','La Rioja',
    'Mendoza','Misiones','Neuquén','Río Negro','Salta','San Juan',
    'San Luis','Santa Cruz','Santa Fe','Santiago del Estero',
    'Tierra del Fuego','Tucumán',
];

const inputBase = {
    width: '100%', height: '50px',
    border: '1.5px solid rgba(34,38,29,.18)',
    background: '#fff', borderRadius: '12px',
    padding: '0 14px 0 44px',
    fontFamily: "'Karla', sans-serif", fontSize: '15px',
    color: '#22261d', outline: 'none',
};
const inputError = { borderColor: '#e53e3e', background: '#fff5f5' };

function Field({ label, field, type = 'text', placeholder, icon: Icon, form, errors, onChange, half = false }) {
    const hasError = !!errors[field];
    return (
        <div style={{ gridColumn: half ? 'auto' : undefined }}>
            <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#22261d', marginBottom: '7px' }}>
                {label}
            </label>
            <div style={{ position: 'relative' }}>
                {Icon && <Icon style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: '#9a9d90', pointerEvents: 'none' }} />}
                <input
                    type={type}
                    value={form[field]}
                    onChange={e => onChange(field, e.target.value)}
                    placeholder={placeholder}
                    style={{ ...inputBase, ...(hasError ? inputError : {}), paddingLeft: Icon ? 44 : 14 }}
                    onFocus={e => { e.target.style.borderColor = '#566a2f'; e.target.style.boxShadow = '0 0 0 4px rgba(86,106,47,.12)'; }}
                    onBlur={e => { e.target.style.borderColor = hasError ? '#e53e3e' : 'rgba(34,38,29,.18)'; e.target.style.boxShadow = 'none'; }}
                />
            </div>
            {hasError && <p style={{ color: '#e53e3e', fontSize: '12.5px', marginTop: '5px' }}>{errors[field]}</p>}
        </div>
    );
}

function PanelHead({ icon: Icon, title }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
            <span style={{ width: 38, height: 38, borderRadius: 11, background: '#eef0e3', color: '#566a2f', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <Icon size={20} strokeWidth={1.9} />
            </span>
            <h2 style={{ fontFamily: serif, fontSize: '22px' }}>{title}</h2>
        </div>
    );
}

export function Checkout() {
    const { cart, totalPrice } = useCart();
    const { user, accessToken } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ ...INITIAL_FORM, name: user?.name ?? '', email: user?.email ?? '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState('home');

    if (cart.length === 0) {
        return (
            <div style={{ background: '#f6f4ec', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <ShoppingBag style={{ width: 72, height: 72, margin: '0 auto 16px', color: '#c9ccbe' }} />
                    <h2 style={{ fontFamily: serif, fontSize: '28px', marginBottom: 12 }}>Tu carrito está vacío</h2>
                    <Link to="/tienda" style={{ color: '#566a2f', fontWeight: 700 }}>Volver a la tienda</Link>
                </div>
            </div>
        );
    }

    function validate() {
        const e = {};
        if (!form.name.trim()) e.name = 'Requerido';
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido';
        if (!form.phone.trim()) e.phone = 'Requerido';
        else if (!/^[\d\s\+\-\(\)]{8,20}$/.test(form.phone.trim())) e.phone = 'Teléfono inválido';
        if (!form.street.trim()) e.street = 'Requerido';
        if (!form.city.trim()) e.city = 'Requerido';
        if (!form.province) e.province = 'Requerido';
        if (!form.postalCode.trim()) e.postalCode = 'Requerido';
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    function handleChange(field, value) {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    async function handlePayment() {
        if (!validate()) return;
        setLoading(true);
        setApiError('');
        sessionStorage.setItem('checkoutCart', JSON.stringify(cart));
        sessionStorage.setItem('checkoutTotal', String(totalPrice));
        try {
            const res = await fetch(`${BASE_URL}/api/checkout/create-preference`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken ?? ''}` },
                body: JSON.stringify({
                    items: cart, total: totalPrice,
                    payer: { name: form.name, email: form.email, phone: form.phone },
                    shipping: { street: form.street, city: form.city, province: form.province, postalCode: form.postalCode },
                    baseUrl: window.location.origin,
                }),
            });
            const text = await res.text();
            let data = {};
            try { data = text ? JSON.parse(text) : {}; } catch { data = {}; }
            if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
            window.location.href = data.init_point;
        } catch (err) {
            const isNetwork = err instanceof TypeError || err.message === 'Failed to fetch';
            if (isNetwork) { navigate('/checkout/exito?simulated=true'); return; }
            setApiError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const fmt = n => '$' + n.toLocaleString('es-AR');

    return (
        <div style={{ background: '#f6f4ec', minHeight: '100vh', paddingBottom: 80 }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px' }}>

                {/* Breadcrumb */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '26px 0 2px', fontSize: 14, color: '#6c7062' }}>
                    <Link to="/tienda" style={{ fontWeight: 600, color: '#6c7062' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#566a2f'}
                        onMouseLeave={e => e.currentTarget.style.color = '#6c7062'}
                    >Tienda</Link>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    <span style={{ color: '#22261d', fontWeight: 700 }}>Checkout</span>
                </nav>

                <h1 style={{ fontFamily: serif, fontSize: 'clamp(32px,5vw,42px)', letterSpacing: '-.4px', margin: '6px 0 22px', color: '#22261d' }}>
                    Finalizar compra
                </h1>

                {/* Stepper */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 34, maxWidth: 560 }}>
                    {/* Step 1: Carrito (done) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                        <span style={{ width: 30, height: 30, borderRadius: '50%', background: '#566a2f', color: '#f3efe0', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                            <Check size={15} strokeWidth={3} />
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#22261d' }}>Carrito</span>
                    </div>
                    <div style={{ flex: 1, height: 2, background: '#566a2f', margin: '0 14px', minWidth: 24 }} />
                    {/* Step 2: Datos (active) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                        <span style={{ width: 30, height: 30, borderRadius: '50%', background: '#c06a34', color: '#fff', display: 'grid', placeItems: 'center', fontSize: '13.5px', fontWeight: 700, boxShadow: '0 0 0 4px rgba(192,106,52,.18)', flexShrink: 0 }}>
                            2
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#22261d' }}>Datos &amp; envío</span>
                    </div>
                    <div style={{ flex: 1, height: 2, background: '#e0ddcf', margin: '0 14px', minWidth: 24 }} />
                    {/* Step 3: Pago (todo) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                        <span style={{ width: 30, height: 30, borderRadius: '50%', background: '#e7e4d6', color: '#6c7062', display: 'grid', placeItems: 'center', fontSize: '13.5px', fontWeight: 700, flexShrink: 0 }}>
                            3
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: '#6c7062' }}>Pago</span>
                    </div>
                </div>

                {/* Two-column layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 28, alignItems: 'start' }}
                    className="checkout-grid">
                    {/* ── LEFT ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

                        {/* Datos de contacto */}
                        <div style={{ background: '#fff', border: '1px solid rgba(34,38,29,.10)', borderRadius: 20, padding: 28, boxShadow: '0 1px 2px rgba(34,38,29,.06),0 6px 16px rgba(34,38,29,.05)' }}>
                            <PanelHead icon={User} title="Datos de contacto" />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <Field label="Nombre completo" field="name" placeholder="Juan Pérez" icon={User} form={form} errors={errors} onChange={handleChange} />
                                <Field label="Email" field="email" type="email" placeholder="juan@ejemplo.com" icon={Mail} form={form} errors={errors} onChange={handleChange} />
                            </div>
                            <div style={{ marginTop: 16, maxWidth: '50%' }}>
                                <Field label="Teléfono" field="phone" type="tel" placeholder="+54 9 11 1234-5678" icon={Phone} form={form} errors={errors} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Dirección de envío */}
                        <div style={{ background: '#fff', border: '1px solid rgba(34,38,29,.10)', borderRadius: 20, padding: 28, boxShadow: '0 1px 2px rgba(34,38,29,.06),0 6px 16px rgba(34,38,29,.05)' }}>
                            <PanelHead icon={MapPin} title="Dirección de envío" />
                            <div style={{ marginBottom: 16 }}>
                                <Field label="Calle y número" field="street" placeholder="Av. San Martín 1234" icon={MapPin} form={form} errors={errors} onChange={handleChange} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                                <Field label="Ciudad" field="city" placeholder="Mendoza" icon={MapPin} form={form} errors={errors} onChange={handleChange} />
                                <div>
                                    <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 700, color: '#22261d', marginBottom: '7px' }}>Provincia</label>
                                    <div style={{ position: 'relative' }}>
                                        <MapPin style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, color: '#9a9d90', pointerEvents: 'none' }} />
                                        <select
                                            value={form.province}
                                            onChange={e => handleChange('province', e.target.value)}
                                            style={{ ...inputBase, appearance: 'none', cursor: 'pointer', color: form.province ? '#22261d' : '#9a9d90', ...(errors.province ? inputError : {}) }}
                                            onFocus={e => { e.target.style.borderColor = '#566a2f'; e.target.style.boxShadow = '0 0 0 4px rgba(86,106,47,.12)'; }}
                                            onBlur={e => { e.target.style.borderColor = errors.province ? '#e53e3e' : 'rgba(34,38,29,.18)'; e.target.style.boxShadow = 'none'; }}
                                        >
                                            <option value="">Seleccionar provincia</option>
                                            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                        <svg style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6c7062' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                    </div>
                                    {errors.province && <p style={{ color: '#e53e3e', fontSize: '12.5px', marginTop: '5px' }}>{errors.province}</p>}
                                </div>
                            </div>
                            <div style={{ maxWidth: '50%' }}>
                                <Field label="Código postal" field="postalCode" placeholder="5500" form={form} errors={errors} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Método de envío */}
                        <div style={{ background: '#fff', border: '1px solid rgba(34,38,29,.10)', borderRadius: 20, padding: 28, boxShadow: '0 1px 2px rgba(34,38,29,.06),0 6px 16px rgba(34,38,29,.05)' }}>
                            <PanelHead icon={Truck} title="Método de envío" />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {[
                                    { id: 'home', label: 'Envío a domicilio', desc: 'Recibilo en 3–7 días hábiles' },
                                    { id: 'pickup', label: 'Retiro en punto de entrega', desc: 'Coordinás por WhatsApp · 24–48hs' },
                                ].map(opt => {
                                    const sel = deliveryMethod === opt.id;
                                    return (
                                        <label
                                            key={opt.id}
                                            onClick={() => setDeliveryMethod(opt.id)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 14,
                                                border: `1.5px solid ${sel ? '#566a2f' : 'rgba(34,38,29,.18)'}`,
                                                borderRadius: 13, padding: '15px 16px', cursor: 'pointer',
                                                background: sel ? '#f4f6ec' : '#fff',
                                                transition: 'border-color .2s, background .2s',
                                            }}
                                        >
                                            <span style={{
                                                width: 20, height: 20, borderRadius: '50%',
                                                border: `2px solid ${sel ? '#566a2f' : '#c9ccbe'}`,
                                                flexShrink: 0, display: 'grid', placeItems: 'center',
                                            }}>
                                                {sel && <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#566a2f', display: 'block' }} />}
                                            </span>
                                            <span style={{ flex: 1 }}>
                                                <b style={{ fontSize: '14.5px', display: 'block' }}>{opt.label}</b>
                                                <span style={{ fontSize: '13px', color: '#6c7062' }}>{opt.desc}</span>
                                            </span>
                                            <span style={{ fontWeight: 700, color: '#566a2f', fontSize: '14.5px' }}>Gratis</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: Summary ── */}
                    <div style={{ position: 'sticky', top: 96, background: '#fff', border: '1px solid rgba(34,38,29,.10)', borderRadius: 20, boxShadow: '0 1px 2px rgba(34,38,29,.06),0 6px 16px rgba(34,38,29,.05)', overflow: 'hidden' }}>
                        {/* Header */}
                        <div style={{ padding: '22px 24px 16px', borderBottom: '1px solid rgba(34,38,29,.10)' }}>
                            <h2 style={{ fontFamily: serif, fontSize: '21px' }}>Resumen del pedido</h2>
                        </div>

                        {/* Items */}
                        <div style={{ padding: '8px 24px', maxHeight: 260, overflowY: 'auto' }}>
                            {cart.map(item => (
                                <div key={item.id} style={{ display: 'flex', gap: 13, padding: '14px 0', borderBottom: '1px solid rgba(34,38,29,.08)' }}>
                                    <div style={{ width: 58, height: 58, borderRadius: 10, overflow: 'hidden', background: '#eceadf', flexShrink: 0, border: '1px solid rgba(34,38,29,.08)', position: 'relative' }}>
                                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.src = ''; }} />
                                        <span style={{ position: 'absolute', top: -7, right: -7, minWidth: 21, height: 21, padding: '0 5px', borderRadius: 999, background: '#566a2f', color: '#f3efe0', fontSize: '11.5px', fontWeight: 700, display: 'grid', placeItems: 'center', border: '2px solid #fff' }}>
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: '14.5px', fontWeight: 700, lineHeight: 1.3, color: '#22261d' }}>{item.name}</p>
                                        <p style={{ fontSize: '12.5px', color: '#6c7062', marginTop: 2 }}>{item.category}</p>
                                    </div>
                                    <p style={{ fontFamily: "'Karla', sans-serif", fontWeight: 700, fontSize: '15px', whiteSpace: 'nowrap', color: '#22261d' }}>
                                        {fmt(item.price * item.quantity)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div style={{ padding: '18px 24px', borderTop: '1px solid rgba(34,38,29,.10)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14.5px', marginBottom: 9 }}>
                                <span style={{ color: '#6c7062' }}>Subtotal</span>
                                <span style={{ fontWeight: 600 }}>{fmt(totalPrice)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14.5px', marginBottom: 9 }}>
                                <span style={{ color: '#6c7062' }}>Envío</span>
                                <span style={{ color: '#566a2f', fontWeight: 700 }}>Gratis</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 14, marginTop: 6, borderTop: '1px solid rgba(34,38,29,.10)' }}>
                                <span style={{ fontSize: '17px', fontWeight: 700 }}>Total</span>
                                <span style={{ fontFamily: "'Karla', sans-serif", fontWeight: 700, fontSize: '30px', color: '#22261d' }}>{fmt(totalPrice)}</span>
                            </div>
                        </div>

                        {/* Pay */}
                        <div style={{ padding: '0 24px 24px' }}>
                            {apiError && (
                                <div style={{ marginBottom: 14, background: '#fff5f5', border: '1px solid rgba(229,62,62,.2)', color: '#c53030', padding: '12px 14px', borderRadius: 12, fontSize: '13.5px' }}>
                                    {apiError}
                                </div>
                            )}
                            <button
                                onClick={handlePayment}
                                disabled={loading}
                                style={{
                                    width: '100%', height: 56, background: '#009ee3', color: '#fff',
                                    border: 'none', borderRadius: 13, fontFamily: "'Karla', sans-serif",
                                    fontWeight: 700, fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    boxShadow: '0 8px 22px rgba(0,158,227,.28)',
                                    opacity: loading ? .6 : 1, transition: 'background .2s, transform .15s',
                                }}
                                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#0089c7'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#009ee3'; }}
                            >
                                {loading ? (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ width: 18, height: 18, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                                        Procesando...
                                    </span>
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="M22 3 2 11l7 2 2 7 3-4 5 4 3-17Z"/></svg>
                                        Pagar con Mercado Pago
                                    </>
                                )}
                            </button>

                            <p style={{ textAlign: 'center', fontSize: '12.5px', color: '#6c7062', marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                <Lock size={13} />
                                Serás redirigido al sitio seguro de Mercado Pago
                            </p>

                            <Link
                                to="/tienda"
                                style={{ display: 'block', textAlign: 'center', marginTop: 14, fontSize: '14px', fontWeight: 700, color: '#566a2f' }}
                                onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                                onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                            >
                                ← Volver a la tienda
                            </Link>

                            {/* Trust badges */}
                            <div style={{ display: 'flex', gap: 8, marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(34,38,29,.10)', flexWrap: 'wrap' }}>
                                {[
                                    { Icon: Package, label: 'Compra protegida' },
                                    { Icon: Truck, label: 'Envío gratis' },
                                    { Icon: RotateCcw, label: 'Devoluciones 30 días' },
                                ].map(({ Icon, label }) => (
                                    <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11.5px', fontWeight: 600, color: '#6c7062' }}>
                                        <Icon size={13} style={{ color: '#566a2f' }} />
                                        {label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 860px) {
                    .checkout-grid { grid-template-columns: 1fr !important; }
                    .checkout-grid > div:last-child { position: static !important; }
                }
                @media (max-width: 560px) {
                    .checkout-grid > div:first-child > div > div[style*="grid-template-columns: 1fr 1fr"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
}
