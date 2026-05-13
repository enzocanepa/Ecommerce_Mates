import { useState, useEffect, useCallback } from 'react';
import { Star, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { reviewService } from '../../services/reviewService';
import { toast } from 'sonner';
function StarDisplay({ rating, max = 5, interactive = false, onChange }) {
    const [hovered, setHovered] = useState(0);
    const displayed = interactive ? (hovered || rating) : rating;
    return (<div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
            const value = i + 1;
            const filled = value <= displayed;
            return (<button key={i} type={interactive ? 'button' : undefined} onClick={interactive ? () => onChange?.(value) : undefined} onMouseEnter={interactive ? () => setHovered(value) : undefined} onMouseLeave={interactive ? () => setHovered(0) : undefined} className={interactive ? 'cursor-pointer' : 'cursor-default'} disabled={!interactive}>
            <Star className={`w-5 h-5 transition-colors ${filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}/>
          </button>);
        })}
    </div>);
}
function averageRating(reviews) {
    if (reviews.length === 0)
        return 0;
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
}
export function ReviewsSection({ productId }) {
    const { user, accessToken } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const hasReviewed = reviews.some((r) => r.userId === user?.id);
    const fetchReviews = useCallback(async () => {
        try {
            const data = await reviewService.getReviews(productId);
            setReviews(data.reviews ?? []);
        }
        catch { /* silent — reviews are non-critical */ }
        finally {
            setLoading(false);
        }
    }, [productId]);
    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);
    async function handleSubmit(e) {
        e.preventDefault();
        if (!accessToken)
            return;
        if (rating === 0) {
            toast.error('Seleccioná una puntuación');
            return;
        }
        setSubmitting(true);
        try {
            await reviewService.createReview(productId, { rating, comment }, accessToken);
            toast.success('¡Reseña publicada!');
            setRating(0);
            setComment('');
            fetchReviews();
        }
        catch (err) {
            toast.error(err.message || 'Error al publicar la reseña');
        }
        finally {
            setSubmitting(false);
        }
    }
    const avg = averageRating(reviews);
    return (<div className="mt-12 bg-white rounded-lg shadow-lg p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Reseñas</h2>
        {reviews.length > 0 && (<div className="flex items-center gap-3">
            <StarDisplay rating={Math.round(avg)}/>
            <span className="text-lg font-bold text-gray-800">{avg.toFixed(1)}</span>
            <span className="text-gray-400 text-sm">({reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'})</span>
          </div>)}
      </div>

      {user && !hasReviewed && (<form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-100">
          <h3 className="text-base font-semibold text-gray-700 mb-4">Dejá tu reseña</h3>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">Tu puntuación</label>
            <StarDisplay rating={rating} interactive onChange={setRating}/>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Comentario (opcional)</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Contá tu experiencia con el producto..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#a8c95f] resize-none"/>
          </div>
          <button type="submit" disabled={submitting || rating === 0} className="bg-[#a8c95f] hover:bg-[#97b84f] text-[#4a5f2f] font-semibold px-5 py-2 rounded-lg transition-colors disabled:opacity-50">
            {submitting ? 'Publicando...' : 'Publicar reseña'}
          </button>
        </form>)}

      {!user && (<div className="bg-blue-50 border border-blue-100 text-blue-700 px-4 py-3 rounded-lg text-sm mb-8">
          <a href="/login" className="font-medium underline">Iniciá sesión</a> para dejar tu reseña.
        </div>)}

      {hasReviewed && (<div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-lg text-sm mb-8">
          Ya publicaste una reseña para este producto.
        </div>)}

      {loading ? (<div className="space-y-4">
          {[1, 2].map((i) => (<div key={i} className="animate-pulse space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded"/>
              <div className="h-3 w-full bg-gray-100 rounded"/>
              <div className="h-3 w-2/3 bg-gray-100 rounded"/>
            </div>))}
        </div>) : reviews.length === 0 ? (<p className="text-gray-400 text-sm text-center py-8">
          Todavía no hay reseñas para este producto. ¡Sé el primero!
        </p>) : (<div className="space-y-6">
          {reviews.map((review) => (<div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-[#c7e47d] flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-[#4a5f2f]"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-medium text-gray-800 text-sm">{review.userName}</span>
                    <StarDisplay rating={review.rating}/>
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString('es-AR', {
                    day: '2-digit', month: 'long', year: 'numeric',
                })}
                    </span>
                  </div>
                  {review.comment && (<p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>)}
                </div>
              </div>
            </div>))}
        </div>)}
    </div>);
}
