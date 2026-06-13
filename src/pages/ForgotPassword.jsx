import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { BrandPanel } from '../components/auth/BrandPanel';
import { getBaseUrl } from '../services/api';
import { toast } from 'sonner';

const serif = "'DM Serif Display', Georgia, serif";
const API = getBaseUrl();

export function ForgotPassword() {
    const navigate = useNavigate();

    // step: 'email' | 'reset' | 'success'
    const [step, setStep]               = useState('email');
    const [email, setEmail]             = useState('');
    const [code, setCode]               = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPwd, setConfirmPwd]   = useState('');
    const [showPwd, setShowPwd]         = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading]         = useState(false);
    const [error, setError]             = useState('');

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim().toLowerCase() }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al enviar el código');
            setStep('reset');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPwd) { setError('Las contraseñas no coinciden'); return; }
        if (newPassword.length < 6)     { setError('La contraseña debe tener al menos 6 caracteres'); return; }
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim().toLowerCase(), code: code.trim(), newPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Código inválido o expirado');
            setStep('success');
            setTimeout(() => { navigate('/login'); toast.success('Contraseña actualizada. Ingresá con tu nueva contraseña.'); }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen lg:grid" style={{ background: '#f6f4ec', gridTemplateColumns: '1.05fr 0.95fr' }}>
            <BrandPanel mode="login" />

            <div className="flex items-center justify-center px-6 py-10 lg:py-0 relative min-h-screen lg:min-h-0">

                <Link
                    to="/login"
                    className="absolute top-7 left-6 flex items-center gap-1.5 text-[13.5px] font-semibold transition-colors"
                    style={{ color: '#6c7062' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#566a2f'}
                    onMouseLeave={e => e.currentTarget.style.color = '#6c7062'}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al login
                </Link>

                <div className="w-full max-w-[400px]">

                    {/* ── SUCCESS ── */}
                    {step === 'success' && (
                        <div className="text-center py-8">
                            <CheckCircle className="w-14 h-14 mx-auto mb-4" style={{ color: '#566a2f' }} />
                            <h1 className="text-[28px] mb-2" style={{ fontFamily: serif, color: '#22261d' }}>
                                ¡Contraseña actualizada!
                            </h1>
                            <p style={{ color: '#6c7062', fontSize: '15px' }}>
                                Redirigiendo al login…
                            </p>
                        </div>
                    )}

                    {/* ── STEP 1: EMAIL ── */}
                    {step === 'email' && (
                        <>
                            <div className="mb-7">
                                <h1 className="text-[34px] tracking-[-0.3px] mb-1.5" style={{ fontFamily: serif, color: '#22261d' }}>
                                    Recuperar contraseña
                                </h1>
                                <p className="text-[15.5px]" style={{ color: '#6c7062' }}>
                                    Ingresá tu email y te enviamos un código de verificación.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-5 px-4 py-3 rounded-[13px] text-[14px]"
                                    style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid rgba(185,28,28,.15)' }}>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleEmailSubmit}>
                                <div className="mb-5">
                                    <label className="block text-[13.5px] font-bold mb-2" style={{ color: '#22261d' }}>Email</label>
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
                                            style={{ height: '52px', padding: '0 46px', borderRadius: '13px', border: '1.5px solid rgba(34,38,29,.12)', background: '#fff', fontSize: '15px', color: '#22261d', fontFamily: "'Karla', sans-serif" }}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2.5 font-bold text-[16px] transition-all duration-200 active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ height: '54px', borderRadius: '13px', background: '#c06a34', color: '#fff', border: 'none', boxShadow: '0 8px 22px rgba(192,106,52,.28)', cursor: loading ? 'not-allowed' : 'pointer' }}
                                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#ab5b2a'; }}
                                    onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#c06a34'; }}
                                >
                                    {loading ? 'Enviando…' : 'Enviar código'}
                                </button>
                            </form>
                        </>
                    )}

                    {/* ── STEP 2: CÓDIGO + NUEVA CONTRASEÑA ── */}
                    {step === 'reset' && (
                        <>
                            <div className="mb-7">
                                <h1 className="text-[34px] tracking-[-0.3px] mb-1.5" style={{ fontFamily: serif, color: '#22261d' }}>
                                    Ingresá el código
                                </h1>
                                <p className="text-[15px]" style={{ color: '#6c7062', lineHeight: 1.55 }}>
                                    Te enviamos un código de 6 dígitos a{' '}
                                    <strong style={{ color: '#22261d' }}>{email}</strong>.
                                    Revisá también la carpeta de spam.
                                </p>
                            </div>

                            {error && (
                                <div className="mb-5 px-4 py-3 rounded-[13px] text-[14px]"
                                    style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid rgba(185,28,28,.15)' }}>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleResetSubmit}>
                                {/* Código */}
                                <div className="mb-[18px]">
                                    <label className="block text-[13.5px] font-bold mb-2" style={{ color: '#22261d' }}>
                                        Código de verificación
                                    </label>
                                    <input
                                        type="text"
                                        value={code}
                                        onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        required
                                        placeholder="123456"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        className="auth-input w-full text-center tracking-[8px] font-bold text-[22px]"
                                        style={{ height: '60px', borderRadius: '13px', border: '1.5px solid rgba(34,38,29,.12)', background: '#fff', color: '#22261d', fontFamily: "'Karla', sans-serif" }}
                                    />
                                </div>

                                {/* Nueva contraseña */}
                                <div className="mb-[18px]">
                                    <label className="block text-[13.5px] font-bold mb-2" style={{ color: '#22261d' }}>
                                        Nueva contraseña
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-[15px] top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9a9d90' }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                        </span>
                                        <input
                                            type={showPwd ? 'text' : 'password'}
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            required
                                            placeholder="••••••••"
                                            minLength={6}
                                            className="auth-input w-full"
                                            style={{ height: '52px', padding: '0 52px 0 46px', borderRadius: '13px', border: '1.5px solid rgba(34,38,29,.12)', background: '#fff', fontSize: '15px', color: '#22261d', fontFamily: "'Karla', sans-serif" }}
                                        />
                                        <button type="button" onClick={() => setShowPwd(v => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{ color: showPwd ? '#566a2f' : '#9a9d90', background: 'none', border: 'none', cursor: 'pointer' }}
                                            onMouseEnter={e => { e.currentTarget.style.color = '#566a2f'; e.currentTarget.style.background = '#eef0e3'; }}
                                            onMouseLeave={e => { e.currentTarget.style.color = showPwd ? '#566a2f' : '#9a9d90'; e.currentTarget.style.background = 'none'; }}
                                        >
                                            {showPwd ? <EyeOff className="w-[19px] h-[19px]" /> : <Eye className="w-[19px] h-[19px]" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirmar contraseña */}
                                <div className="mb-6">
                                    <label className="block text-[13.5px] font-bold mb-2" style={{ color: '#22261d' }}>
                                        Confirmar contraseña
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-[15px] top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9a9d90' }}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                        </span>
                                        <input
                                            type={showConfirm ? 'text' : 'password'}
                                            value={confirmPwd}
                                            onChange={e => setConfirmPwd(e.target.value)}
                                            required
                                            placeholder="••••••••"
                                            className="auth-input w-full"
                                            style={{ height: '52px', padding: '0 52px 0 46px', borderRadius: '13px', border: '1.5px solid rgba(34,38,29,.12)', background: '#fff', fontSize: '15px', color: '#22261d', fontFamily: "'Karla', sans-serif" }}
                                        />
                                        <button type="button" onClick={() => setShowConfirm(v => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center"
                                            style={{ color: showConfirm ? '#566a2f' : '#9a9d90', background: 'none', border: 'none', cursor: 'pointer' }}
                                            onMouseEnter={e => { e.currentTarget.style.color = '#566a2f'; e.currentTarget.style.background = '#eef0e3'; }}
                                            onMouseLeave={e => { e.currentTarget.style.color = showConfirm ? '#566a2f' : '#9a9d90'; e.currentTarget.style.background = 'none'; }}
                                        >
                                            {showConfirm ? <EyeOff className="w-[19px] h-[19px]" /> : <Eye className="w-[19px] h-[19px]" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || code.length < 6}
                                    className="w-full flex items-center justify-center gap-2.5 font-bold text-[16px] transition-all duration-200 active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ height: '54px', borderRadius: '13px', background: '#c06a34', color: '#fff', border: 'none', boxShadow: '0 8px 22px rgba(192,106,52,.28)', cursor: loading ? 'not-allowed' : 'pointer' }}
                                    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#ab5b2a'; }}
                                    onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#c06a34'; }}
                                >
                                    {loading ? 'Verificando…' : 'Cambiar contraseña'}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => { setStep('email'); setError(''); setCode(''); }}
                                    className="w-full mt-3 text-[13.5px] font-semibold"
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6c7062' }}
                                >
                                    ¿No recibiste el código? Volver a intentar
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
