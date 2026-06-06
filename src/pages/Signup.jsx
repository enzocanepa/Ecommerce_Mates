import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { BrandPanel } from '../components/auth/BrandPanel';

const serif = "'DM Serif Display', Georgia, serif";

const STRENGTH_COLORS = ['#e4e1d3', '#c0392b', '#d9a23a', '#7fae3f', '#566a2f'];
const STRENGTH_HINTS = [
    'Usá 8+ caracteres con números y mayúsculas.',
    'Débil — agregá mayúsculas o números.',
    'Aceptable — sumá un símbolo.',
    'Buena contraseña.',
    'Excelente contraseña.',
];

function getStrength(pwd) {
    if (!pwd) return 0;
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
}

export function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        setLoading(true);
        try {
            const result = await signUp(email, password, name);
            if (result.needsConfirmation) {
                setSuccess('¡Cuenta creada! Revisá tu email para confirmar tu cuenta antes de iniciar sesión.');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Error al crear la cuenta');
        } finally {
            setLoading(false);
        }
    };

    const strength = getStrength(password);

    return (
        <div
            className="min-h-screen lg:grid"
            style={{ background: '#f6f4ec', gridTemplateColumns: '1.05fr 0.95fr' }}
        >
            <BrandPanel mode="register" />

            {/* Form side */}
            <div className="flex items-center justify-center px-6 py-6 lg:py-8 relative min-h-screen lg:min-h-0">

                {/* Top switch — desktop */}
                <p className="absolute top-7 right-8 hidden lg:block text-[14px]" style={{ color: '#6c7062' }}>
                    ¿Ya tenés cuenta?{' '}
                    <Link
                        to="/login"
                        className="font-bold transition-all"
                        style={{ color: '#566a2f' }}
                        onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                    >
                        Iniciá sesión
                    </Link>
                </p>

                <div className="w-full max-w-[400px]">

                    {success ? (
                        /* Success state */
                        <div
                            className="rounded-2xl p-8 text-center"
                            style={{ background: '#fff', border: '1px solid rgba(34,38,29,.10)' }}
                        >
                            <span
                                className="w-16 h-16 rounded-[18px] grid place-items-center mx-auto mb-5"
                                style={{ background: '#eef0e3', color: '#566a2f' }}
                            >
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                            </span>
                            <h2 className="text-[26px] mb-2" style={{ fontFamily: serif, color: '#22261d' }}>
                                ¡Cuenta creada!
                            </h2>
                            <p className="text-[15px] mb-6" style={{ color: '#6c7062', lineHeight: 1.6 }}>{success}</p>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center font-bold text-[15px] transition-all duration-200 active:translate-y-px"
                                style={{
                                    height: '50px',
                                    padding: '0 28px',
                                    borderRadius: '13px',
                                    background: '#c06a34',
                                    color: '#fff',
                                    boxShadow: '0 8px 22px rgba(192,106,52,.28)',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#ab5b2a'}
                                onMouseLeave={e => e.currentTarget.style.background = '#c06a34'}
                            >
                                Ir al login
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Form header */}
                            <div className="mb-7">
                                <h1
                                    className="text-[34px] tracking-[-0.3px] mb-1.5"
                                    style={{ fontFamily: serif, color: '#22261d' }}
                                >
                                    Crear cuenta
                                </h1>
                                <p className="text-[15.5px]" style={{ color: '#6c7062' }}>
                                    Es rápido y gratis. Empezá tu primera ronda.
                                </p>
                            </div>

                            {error && (
                                <div
                                    className="mb-5 px-4 py-3 rounded-[13px] text-[14px]"
                                    style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid rgba(185,28,28,.15)' }}
                                >
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>

                                {/* Name */}
                                <div className="mb-[18px]">
                                    <label className="block text-[13.5px] font-bold mb-2" style={{ color: '#22261d' }}>
                                        Nombre completo
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-[15px] top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9a9d90' }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>
                                        </span>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            required
                                            placeholder="Tu nombre"
                                            className="auth-input w-full"
                                            style={{
                                                height: '52px',
                                                padding: '0 46px',
                                                borderRadius: '13px',
                                                border: '1.5px solid rgba(34,38,29,.12)',
                                                background: '#fff',
                                                fontSize: '15px',
                                                color: '#22261d',
                                                fontFamily: "'Karla', sans-serif",
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="mb-[18px]">
                                    <label className="block text-[13.5px] font-bold mb-2" style={{ color: '#22261d' }}>
                                        Email
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-[15px] top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9a9d90' }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>
                                        </span>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                            placeholder="tu@email.com"
                                            className="auth-input w-full"
                                            style={{
                                                height: '52px',
                                                padding: '0 46px',
                                                borderRadius: '13px',
                                                border: '1.5px solid rgba(34,38,29,.12)',
                                                background: '#fff',
                                                fontSize: '15px',
                                                color: '#22261d',
                                                fontFamily: "'Karla', sans-serif",
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="mb-[18px]">
                                    <label className="block text-[13.5px] font-bold mb-2" style={{ color: '#22261d' }}>
                                        Contraseña
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-[15px] top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9a9d90' }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                        </span>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                            placeholder="••••••••"
                                            className="auth-input w-full"
                                            style={{
                                                height: '52px',
                                                padding: '0 52px 0 46px',
                                                borderRadius: '13px',
                                                border: '1.5px solid rgba(34,38,29,.12)',
                                                background: '#fff',
                                                fontSize: '15px',
                                                color: '#22261d',
                                                fontFamily: "'Karla', sans-serif",
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(v => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                                            style={{ color: showPassword ? '#566a2f' : '#9a9d90', background: 'none', border: 'none', cursor: 'pointer' }}
                                            onMouseEnter={e => { e.currentTarget.style.color = '#566a2f'; e.currentTarget.style.background = '#eef0e3'; }}
                                            onMouseLeave={e => { e.currentTarget.style.color = showPassword ? '#566a2f' : '#9a9d90'; e.currentTarget.style.background = 'none'; }}
                                            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                        >
                                            {showPassword ? <EyeOff className="w-[19px] h-[19px]" /> : <Eye className="w-[19px] h-[19px]" />}
                                        </button>
                                    </div>

                                    {/* Strength bars */}
                                    <div className="flex gap-[5px] mt-[9px]">
                                        {[1, 2, 3, 4].map(n => (
                                            <div
                                                key={n}
                                                className="flex-1 h-1 rounded-full transition-all duration-300"
                                                style={{ background: strength >= n ? STRENGTH_COLORS[strength] : '#e4e1d3' }}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[12px] mt-1.5" style={{ color: '#6c7062', minHeight: '15px' }}>
                                        {STRENGTH_HINTS[strength]}
                                    </p>
                                </div>

                                {/* Confirm password */}
                                <div className="mb-[6px]">
                                    <label className="block text-[13.5px] font-bold mb-2" style={{ color: '#22261d' }}>
                                        Confirmar contraseña
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-[15px] top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9a9d90' }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                        </span>
                                        <input
                                            type={showConfirm ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            required
                                            placeholder="••••••••"
                                            className="auth-input w-full"
                                            style={{
                                                height: '52px',
                                                padding: '0 52px 0 46px',
                                                borderRadius: '13px',
                                                border: '1.5px solid rgba(34,38,29,.12)',
                                                background: '#fff',
                                                fontSize: '15px',
                                                color: '#22261d',
                                                fontFamily: "'Karla', sans-serif",
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirm(v => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                                            style={{ color: showConfirm ? '#566a2f' : '#9a9d90', background: 'none', border: 'none', cursor: 'pointer' }}
                                            onMouseEnter={e => { e.currentTarget.style.color = '#566a2f'; e.currentTarget.style.background = '#eef0e3'; }}
                                            onMouseLeave={e => { e.currentTarget.style.color = showConfirm ? '#566a2f' : '#9a9d90'; e.currentTarget.style.background = 'none'; }}
                                            aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                        >
                                            {showConfirm ? <EyeOff className="w-[19px] h-[19px]" /> : <Eye className="w-[19px] h-[19px]" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2.5 font-bold text-[16px] transition-all duration-200 active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                                    style={{
                                        height: '54px',
                                        borderRadius: '13px',
                                        background: '#c06a34',
                                        color: '#fff',
                                        border: 'none',
                                        boxShadow: '0 8px 22px rgba(192,106,52,.28)',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                    }}
                                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#ab5b2a'; }}
                                    onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#c06a34'; }}
                                >
                                    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="4"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M19 8v6M22 11h-6"/></svg>
                                    {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                                </button>
                            </form>

                            {/* Terms */}
                            <p className="mt-[18px] text-center text-[12.5px]" style={{ color: '#6c7062', lineHeight: 1.5 }}>
                                Al crear tu cuenta aceptás los{' '}
                                <span className="font-semibold" style={{ color: '#566a2f' }}>Términos</span>
                                {' '}y la{' '}
                                <span className="font-semibold" style={{ color: '#566a2f' }}>Política de privacidad</span>.
                            </p>

                            {/* Bottom switch */}
                            <p className="mt-5 text-center text-[14.5px]" style={{ color: '#6c7062' }}>
                                ¿Ya tenés cuenta?{' '}
                                <Link
                                    to="/login"
                                    className="font-bold transition-all"
                                    style={{ color: '#566a2f' }}
                                    onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                                    onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                                >
                                    Iniciá sesión
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
