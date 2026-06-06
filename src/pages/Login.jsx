import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { BrandPanel } from '../components/auth/BrandPanel';

const serif = "'DM Serif Display', Georgia, serif";

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signIn(email, password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen lg:grid"
            style={{ background: '#f6f4ec', gridTemplateColumns: '1.05fr 0.95fr' }}
        >
            <BrandPanel mode="login" />

            {/* Form side */}
            <div className="flex items-center justify-center px-6 py-6 lg:py-0 relative min-h-screen lg:min-h-0">

                {/* Top switch — desktop */}
                <p className="absolute top-7 right-8 hidden lg:block text-[14px]" style={{ color: '#6c7062' }}>
                    ¿No tenés cuenta?{' '}
                    <Link
                        to="/registro"
                        className="font-bold transition-all"
                        style={{ color: '#566a2f' }}
                        onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                        onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                    >
                        Registrate
                    </Link>
                </p>

                <div className="w-full max-w-[400px]">

                    {/* Form header */}
                    <div className="mb-7">
                        <h1
                            className="text-[34px] tracking-[-0.3px] mb-1.5"
                            style={{ fontFamily: serif, color: '#22261d' }}
                        >
                            Iniciar sesión
                        </h1>
                        <p className="text-[15.5px]" style={{ color: '#6c7062' }}>
                            Qué bueno verte de nuevo. Ingresá tus datos.
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
                        <div className="mb-4">
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
                        </div>

                        {/* Remember + forgot */}
                        <div className="flex items-center justify-between mb-[22px]">
                            <label className="flex items-center gap-2 text-[13.5px] cursor-pointer select-none" style={{ color: '#6c7062' }}>
                                <input type="checkbox" className="w-[17px] h-[17px] cursor-pointer" style={{ accentColor: '#566a2f' }} />
                                Recordarme
                            </label>
                            <span className="text-[13.5px] font-bold" style={{ color: '#566a2f' }}>
                                ¿Olvidaste tu contraseña?
                            </span>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2.5 font-bold text-[16px] transition-all duration-200 active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
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
                            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/></svg>
                            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                        </button>
                    </form>

                    {/* Bottom switch */}
                    <p className="mt-[22px] text-center text-[14.5px]" style={{ color: '#6c7062' }}>
                        ¿No tenés cuenta?{' '}
                        <Link
                            to="/registro"
                            className="font-bold transition-all"
                            style={{ color: '#566a2f' }}
                            onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                            onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                        >
                            Registrate gratis
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
