import { Hono } from "npm:hono";
import { requireAuth } from "../middleware/auth.ts";
import { sendEmail, orderConfirmationEmailHtml } from "../services/email.ts";
import * as kv from "../kv_store.tsx";

const ordersRoutes = new Hono();

ordersRoutes.post("/", async (c) => {
  try {
    const user = await requireAuth(c);
    if (!user) return c.json({ error: 'Unauthorized' }, 401);

    const { cart, total } = await c.req.json();
    const existingOrders = await kv.get(`orders:${user.id}`) || [];

    const order = {
      id: crypto.randomUUID(),
      userId: user.id,
      items: cart,
      total,
      status: 'completed',
      createdAt: new Date().toISOString(),
    };

    await kv.set(`orders:${user.id}`, [order, ...existingOrders]);
    await kv.set(`cart:${user.id}`, []);

    const allOrderIds: string[] = await kv.get("orders:index") || [];
    await kv.set("orders:index", [user.id, ...allOrderIds.filter((id: string) => id !== user.id)]);

    sendEmail(
      user.email ?? '',
      `Pedido confirmado #${order.id.slice(0, 8)} — Mates Aconcagua`,
      orderConfirmationEmailHtml(order)
    );

    return c.json({ order });
  } catch (error) {
    console.log(`Create order error: ${error}`);
    return c.json({ error: 'Failed to create order' }, 500);
  }
});

ordersRoutes.get("/", async (c) => {
  try {
    const user = await requireAuth(c);
    if (!user) return c.json({ error: 'Unauthorized' }, 401);

    const orders = await kv.get(`orders:${user.id}`);
    return c.json({ orders: orders || [] });
  } catch (error) {
    console.log(`Get orders error: ${error}`);
    return c.json({ error: 'Failed to get orders' }, 500);
  }
});

export { ordersRoutes };
