import { useState, useEffect, useCallback } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { reviewService } from '../../services/reviewService';
import { toast } from 'sonner';

function StarDisplay({ rating, max = 5, interactive = false, onChange, size = 'md' }) {
    const [hovered, setHovered] = useState(0);
    const displayed = interactive ? (hovered || rating) : rating;
    const sz = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: max }).map((_, i) => {
                const value = i + 1;
                const filled = value <= displayed;
                return (
                    <button
                        key={i}
                        type={interactive ? 'button' : undefined}
                        onClick={interactive ? () => onChange?.(value) : undefined}
                        onMouseEnter={interactive ? () => setHovered(value) : undefined}
                        onMouseLeave={interactive ? () => setHovered(0) : undefined}
                        className={interactive ? 'cursor-pointer' : 'cursor-default'}
                        disabled={!interactive}
                    >
                        <Star className={`${sz} transition-colors ${filled ? 'fill-[#c06a34] text-[#c06a34]' : 'text-[#d4c5a9]'}`} />
                    </button>
                );
            })}
        </div>
    );
}

function UserAvatar({ name }) {
    const initials = name
        ? name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
        : '?';
    const palette = ['#566a2f', '#c06a34', '#4a6741', '#7a5230', '#3d6b4f'];
    const bg = name ? palette[name.charCodeAt(0) % palette.length] : palette[0];
    return (
        <div
            className="flex items-center justify-center rounded-full flex-shrink-0 text-white font-bold text-sm"
            style={{ width: 40, height: 40, background: bg }}
        >
            {initials}
        </div>
    );
}

function timeAgo(dateStr) {
    const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
    if (days < 1) return 'Hoy';
    if (days < 7) return `Hace ${days} día${days !== 1 ? 's' : ''}`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `Hace ${weeks} semana${weeks !== 1 ? 's' : ''}`;
    const months = Math.floor(days / 30);
    if (months < 12) return `Hace ${months} mes${months !== 1 ? 'es' : ''}`;
    const years = Math.floor(days / 365);
    return `Hace ${years} año${years !== 1 ? 's' : ''}`;
}

function averageRating(reviews) {
    if (reviews.length === 0) return 0;
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}

export function ReviewsSection({ productId }) {
    const { user, accessToken } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const hasReviewed = reviews.some(r => r.user?.id === user?.id);

    const fetchReviews = useCallback(async () => {
        try {
            const data = await reviewService.getReviews(productId);
            setReviews(data.reviews ?? []);
        } catch { /* silent */ }
        finally { setLoading(false); }
    }, [productId]);

    useEffect(() => { fetchReviews(); }, [fetchReviews]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!accessToken) return;
        if (rating === 0) { toast.error('Seleccioná una puntuación'); return; }
        setSubmitting(true);
        try {
            await reviewService.createReview(productId, { rating, comment }, accessToken);
            toast.success('¡Reseña publicada!');
            setRating(0);
            setComment('');
            fetchReviews();
        } catch (err) {
            toast.error(err.message || 'Error al publicar la reseña');
        } finally {
            setSubmitting(false);
        }
    }

    const avg = averageRating(reviews);
    const showForm = user && !hasReviewed;

    return (
        <div className="mt-12" style={{ background: '#f6f4ec', borderRadius: 20, padding: '36px 36px' }}>
            <h2
                className="text-2xl font-bold text-[#22261d] mb-6"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
            >
                Reseñas
            </h2>

            <div className={`flex gap-8 ${showForm ? 'flex-col md:flex-row' : 'flex-col'}`}>

                {/* Formulario */}
                {showForm && (
                    <form
                        onSubmit={handleSubmit}
                        className="flex-shrink-0 md:w-[280px] bg-white rounded-2xl p-5"
                        style={{ border: '1px solid rgba(34,38,29,.10)' }}
                    >
                        <h3 className="font-bold text-[#22261d] mb-4">Dejá tu reseña</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-[#566a2f] mb-2">Tu puntuación</label>
                            <StarDisplay rating={rating} interactive onChange={setRating} />
                        </div>
                        <div className="mb-5">
                            <label className="block text-sm font-semibold text-[#566a2f] mb-1">Comentario (opcional)</label>
                            <textarea
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                rows={4}
                                placeholder="Contá tu experiencia con el producto..."
                                className="w-full rounded-xl px-3 py-2 text-sm focus:outline-none resize-none text-[#22261d]"
                                style={{ border: '1px solid rgba(34,38,29,.15)', background: '#faf9f4' }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting || rating === 0}
                            className="w-full font-bold text-sm rounded-full h-[44px] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ background: '#566a2f', color: '#f5f2e6' }}
                            onMouseEnter={e => { if (rating > 0 && !submitting) e.currentTarget.style.background = '#465824'; }}
                            onMouseLeave={e => { if (rating > 0 && !submitting) e.currentTarget.style.background = '#566a2f'; }}
                        >
                            {submitting ? 'Publicando...' : 'Publicar reseña'}
                        </button>
                    </form>
                )}

                {/* Panel derecho: resumen + lista */}
                <div className="flex-1">
                    {!user && (
                        <div className="bg-white rounded-xl px-4 py-3 text-sm mb-5" style={{ border: '1px solid rgba(34,38,29,.10)' }}>
                            <a href="/acceso" className="font-semibold text-[#566a2f] underline">Iniciá sesión</a>
                            <span className="text-[#6c7062]"> para dejar tu reseña.</span>
                        </div>
                    )}

                    {hasReviewed && (
                        <div className="bg-white rounded-xl px-4 py-3 text-sm text-[#566a2f] font-semibold mb-5" style={{ border: '1px solid rgba(86,106,47,.2)' }}>
                            Ya publicaste una reseña para este producto.
                        </div>
                    )}

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2].map(i => (
                                <div key={i} className="animate-pulse space-y-2">
                                    <div className="h-4 w-32 bg-[#e0ddd0] rounded" />
                                    <div className="h-3 w-full bg-[#eceadf] rounded" />
                                </div>
                            ))}
                        </div>
                    ) : reviews.length === 0 ? (
                        <p className="text-[#9a9d90] text-sm text-center py-10">
                            Todavía no hay reseñas para este producto. ¡Sé el primero!
                        </p>
                    ) : (
                        <>
                            {/* Resumen de rating */}
                            <div className="flex items-center gap-4 pb-5 mb-5" style={{ borderBottom: '1px solid rgba(34,38,29,.10)' }}>
                                <span
                                    className="text-5xl font-bold text-[#22261d] leading-none"
                                    style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}
                                >
                                    {avg.toFixed(1)}
                                </span>
                                <div>
                                    <StarDisplay rating={Math.round(avg)} size="lg" />
                                    <p className="text-xs text-[#6c7062] mt-1">
                                        Basado en {reviews.length} reseña{reviews.length !== 1 ? 's' : ''} de clientes
                                    </p>
                                </div>
                            </div>

                            {/* Lista de reseñas */}
                            <div className="space-y-5">
                                {reviews.map(review => (
                                    <div key={review.id} className="flex gap-3 pb-5" style={{ borderBottom: '1px solid rgba(34,38,29,.08)' }}>
                                        <UserAvatar name={review.user?.name ?? 'Usuario'} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-[#22261d] text-sm">
                                                        {review.user?.name ?? 'Usuario'}
                                                    </span>
                                                    <StarDisplay rating={review.rating} />
                                                </div>
                                                <span className="text-xs text-[#9a9d90]">
                                                    {timeAgo(review.createdAt)}
                                                </span>
                                            </div>
                                            {review.comment && (
                                                <p className="text-[#4a4d42] text-sm leading-relaxed">{review.comment}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
