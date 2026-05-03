import { Hono } from "npm:hono";
import { requireAuth } from "../middleware/auth.ts";
import * as kv from "../kv_store.tsx";

const reviewsRoutes = new Hono();

reviewsRoutes.get("/:productId", async (c) => {
  try {
    const { productId } = c.req.param();
    const reviews = await kv.get(`reviews:${productId}`) || [];
    return c.json({ reviews });
  } catch (error) {
    return c.json({ error: 'Error al obtener reseñas' }, 500);
  }
});

reviewsRoutes.post("/:productId", async (c) => {
  try {
    const user = await requireAuth(c);
    if (!user) return c.json({ error: 'Unauthorized' }, 401);

    const { productId } = c.req.param();
    const { rating, comment } = await c.req.json();

    if (!rating || rating < 1 || rating > 5) {
      return c.json({ error: 'Rating debe ser entre 1 y 5' }, 400);
    }

    const existing: any[] = await kv.get(`reviews:${productId}`) || [];

    if (existing.some((r: any) => r.userId === user.id)) {
      return c.json({ error: 'Ya dejaste una reseña para este producto' }, 400);
    }

    const review = {
      id: crypto.randomUUID(),
      productId: Number(productId),
      userId: user.id,
      userName: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario',
      rating: Number(rating),
      comment: String(comment || '').trim(),
      createdAt: new Date().toISOString(),
    };

    await kv.set(`reviews:${productId}`, [review, ...existing]);
    return c.json({ review });
  } catch (error) {
    return c.json({ error: 'Error al guardar reseña' }, 500);
  }
});

export { reviewsRoutes };
