import { Hono } from "npm:hono";
import { requireAdmin } from "../middleware/auth.ts";
import * as kv from "../kv_store.tsx";

const productsRoutes = new Hono();

productsRoutes.get("/", async (c) => {
  try {
    const products = await kv.get("products:all");
    return c.json({ products: products || [] });
  } catch (error) {
    console.log(`Get products error: ${error}`);
    return c.json({ error: 'Failed to get products' }, 500);
  }
});

productsRoutes.post("/", async (c) => {
  try {
    const user = await requireAdmin(c);
    if (!user) return c.json({ error: 'Forbidden' }, 403);

    const { products } = await c.req.json();
    if (!Array.isArray(products)) return c.json({ error: 'Invalid payload' }, 400);

    await kv.set("products:all", products);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Save products error: ${error}`);
    return c.json({ error: 'Failed to save products' }, 500);
  }
});

export { productsRoutes };
