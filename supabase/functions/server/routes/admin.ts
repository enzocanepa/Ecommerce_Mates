import { Hono } from "npm:hono";
import { requireAdmin } from "../middleware/auth.ts";
import * as kv from "../kv_store.tsx";

const adminRoutes = new Hono();

adminRoutes.get("/orders", async (c) => {
  try {
    const user = await requireAdmin(c);
    if (!user) return c.json({ error: 'Forbidden' }, 403);

    const userIds: string[] = await kv.get("orders:index") || [];
    const allOrders = await Promise.all(
      userIds.map((uid: string) => kv.get(`orders:${uid}`).then((o: any) => o || []))
    );

    const flat = allOrders.flat().sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return c.json({ orders: flat });
  } catch (error) {
    console.log(`Admin get orders error: ${error}`);
    return c.json({ error: 'Failed to get orders' }, 500);
  }
});

export { adminRoutes };
