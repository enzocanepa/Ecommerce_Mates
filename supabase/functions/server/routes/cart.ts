import { Hono } from "npm:hono";
import { requireAuth } from "../middleware/auth.ts";
import * as kv from "../kv_store.tsx";

const cartRoutes = new Hono();

cartRoutes.get("/", async (c) => {
  try {
    const user = await requireAuth(c);
    if (!user) return c.json({ error: 'Unauthorized' }, 401);

    const cart = await kv.get(`cart:${user.id}`);
    return c.json({ cart: cart || [] });
  } catch (error) {
    console.log(`Get cart error: ${error}`);
    return c.json({ error: 'Failed to get cart' }, 500);
  }
});

cartRoutes.post("/", async (c) => {
  try {
    const user = await requireAuth(c);
    if (!user) return c.json({ error: 'Unauthorized' }, 401);

    const { cart } = await c.req.json();
    await kv.set(`cart:${user.id}`, cart);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Save cart error: ${error}`);
    return c.json({ error: 'Failed to save cart' }, 500);
  }
});

export { cartRoutes };
