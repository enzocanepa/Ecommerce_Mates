import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { authRoutes } from "./routes/auth.ts";
import { productsRoutes } from "./routes/products.ts";
import { cartRoutes } from "./routes/cart.ts";
import { ordersRoutes } from "./routes/orders.ts";
import { adminRoutes } from "./routes/admin.ts";
import { reviewsRoutes } from "./routes/reviews.ts";
import { checkoutRoutes } from "./routes/checkout.ts";
import { aiRoutes } from "./routes/ai.ts";

const app = new Hono();

app.use('*', logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

const BASE = "/make-server-a8bad502";

app.route(BASE, authRoutes);
app.route(`${BASE}/products`, productsRoutes);
app.route(`${BASE}/cart`, cartRoutes);
app.route(`${BASE}/orders`, ordersRoutes);
app.route(`${BASE}/admin`, adminRoutes);
app.route(`${BASE}/reviews`, reviewsRoutes);
app.route(`${BASE}/checkout`, checkoutRoutes);
app.route(`${BASE}/ai`, aiRoutes);

Deno.serve(app.fetch);
