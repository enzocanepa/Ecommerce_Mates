import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { stream } from "npm:hono/streaming";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";
import Anthropic from "npm:@anthropic-ai/sdk";

const app = new Hono();

app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// ── helpers ────────────────────────────────────────────────────────────────

function makeSupabase() {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
}

async function getAuthUser(authHeader: string | undefined) {
  const token = authHeader?.split(' ')[1];
  if (!token) return null;
  const supabase = makeSupabase();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

async function requireAuth(c: any) {
  const user = await getAuthUser(c.req.header('Authorization'));
  if (!user) {
    c.status(401);
    return null;
  }
  return user;
}

async function requireAdmin(c: any) {
  const user = await requireAuth(c);
  if (!user) return null;
  if (user.user_metadata?.role !== 'admin') {
    c.status(403);
    return null;
  }
  return user;
}

// ── health ─────────────────────────────────────────────────────────────────

app.get("/make-server-a8bad502/health", (c) => c.json({ status: "ok" }));

// ── auth ───────────────────────────────────────────────────────────────────

app.post("/make-server-a8bad502/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    const supabase = makeSupabase();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: 'user' },
      email_confirm: true,
    });

    if (error) return c.json({ error: error.message }, 400);

    // Send welcome email (non-blocking)
    sendEmail(email, '¡Bienvenido/a a Mates Aconcagua! 🧉', welcomeEmailHtml(name));

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// ── products (public read) ─────────────────────────────────────────────────

app.get("/make-server-a8bad502/products", async (c) => {
  try {
    const products = await kv.get("products:all");
    return c.json({ products: products || [] });
  } catch (error) {
    console.log(`Get products error: ${error}`);
    return c.json({ error: 'Failed to get products' }, 500);
  }
});

// ── products (admin write) ─────────────────────────────────────────────────

app.post("/make-server-a8bad502/products", async (c) => {
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

// ── cart ───────────────────────────────────────────────────────────────────

app.get("/make-server-a8bad502/cart", async (c) => {
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

app.post("/make-server-a8bad502/cart", async (c) => {
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

// ── orders (user) ──────────────────────────────────────────────────────────

app.post("/make-server-a8bad502/orders", async (c) => {
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

    // Register user id in global index for admin access
    const allOrderIds: string[] = await kv.get("orders:index") || [];
    await kv.set("orders:index", [user.id, ...allOrderIds.filter(id => id !== user.id)]);

    // Send confirmation email (non-blocking)
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

app.get("/make-server-a8bad502/orders", async (c) => {
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

// ── Mercado Pago ───────────────────────────────────────────────────────────

app.post("/make-server-a8bad502/checkout/create-preference", async (c) => {
  try {
    const user = await requireAuth(c);
    if (!user) return c.json({ error: 'Unauthorized' }, 401);

    const { items, total, payer, shipping, baseUrl } = await c.req.json();

    const mpAccessToken = Deno.env.get('MP_ACCESS_TOKEN');
    if (!mpAccessToken) {
      return c.json({ error: 'Mercado Pago no está configurado. Agregá MP_ACCESS_TOKEN a las variables de entorno.' }, 500);
    }

    const isSandbox = mpAccessToken.startsWith('TEST-') || mpAccessToken.startsWith('APP_USR-');
    const origin = baseUrl || 'http://localhost:5173';

    const preferenceBody = {
      items: items.map((item: any) => ({
        id: String(item.id),
        title: item.name,
        description: item.description || item.name,
        picture_url: item.image,
        category_id: item.category,
        quantity: item.quantity,
        currency_id: 'ARS',
        unit_price: item.price,
      })),
      payer: {
        name: payer.name,
        email: payer.email,
        phone: { area_code: '', number: payer.phone },
      },
      shipments: {
        receiver_address: {
          street_name: shipping.street,
          city_name: shipping.city,
          state_name: shipping.province,
          zip_code: shipping.postalCode,
        },
      },
      back_urls: {
        success: `${origin}/checkout/exito`,
        failure: `${origin}/checkout/error`,
        pending: `${origin}/checkout/pendiente`,
      },
      auto_return: 'approved',
      external_reference: crypto.randomUUID(),
      metadata: {
        userId: user.id,
        shippingData: shipping,
      },
    };

    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mpAccessToken}`,
      },
      body: JSON.stringify(preferenceBody),
    });

    const mpData = await mpRes.json();

    if (!mpRes.ok) {
      console.log(`MP error: ${JSON.stringify(mpData)}`);
      return c.json({ error: mpData.message || 'Error al crear preferencia de pago' }, 400);
    }

    // Use sandbox URL for test tokens
    const initPoint = isSandbox && mpData.sandbox_init_point
      ? mpData.sandbox_init_point
      : mpData.init_point;

    return c.json({
      init_point: initPoint,
      preference_id: mpData.id,
      external_reference: preferenceBody.external_reference,
    });
  } catch (error) {
    console.log(`Create preference error: ${error}`);
    return c.json({ error: 'Error interno al procesar el pago' }, 500);
  }
});

// ── orders (admin) ─────────────────────────────────────────────────────────

app.get("/make-server-a8bad502/admin/orders", async (c) => {
  try {
    const user = await requireAdmin(c);
    if (!user) return c.json({ error: 'Forbidden' }, 403);

    const userIds: string[] = await kv.get("orders:index") || [];
    const allOrders = await Promise.all(
      userIds.map((uid) => kv.get(`orders:${uid}`).then(o => o || []))
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

// ── Reviews ────────────────────────────────────────────────────────────────

app.get("/make-server-a8bad502/reviews/:productId", async (c) => {
  try {
    const { productId } = c.req.param();
    const reviews = await kv.get(`reviews:${productId}`) || [];
    return c.json({ reviews });
  } catch (error) {
    return c.json({ error: 'Error al obtener reseñas' }, 500);
  }
});

app.post("/make-server-a8bad502/reviews/:productId", async (c) => {
  try {
    const user = await requireAuth(c);
    if (!user) return c.json({ error: 'Unauthorized' }, 401);

    const { productId } = c.req.param();
    const { rating, comment } = await c.req.json();

    if (!rating || rating < 1 || rating > 5) {
      return c.json({ error: 'Rating debe ser entre 1 y 5' }, 400);
    }

    const existing: any[] = await kv.get(`reviews:${productId}`) || [];

    // One review per user per product
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

// ── AI ─────────────────────────────────────────────────────────────────────

const CHAT_SYSTEM_PROMPT = `Sos el asistente virtual de Mates Aconcagua, una tienda online argentina especializada en mates y accesorios.

Podés ayudar con:
- Información sobre productos: mates (calabaza, madera, cerámica, acero), bombillas (alpaca, acero, plata, bambú), yerba mate (premium, orgánica, compuesta, barbacuá) y accesorios (termos Stanley, tapas)
- Precios: entre $1.100 y $15.000 ARS según el producto
- Envíos: GRATIS en todos los pedidos. 24-48hs en CABA y GBA. 3 a 7 días hábiles para el interior del país
- Pagos: Mercado Pago, tarjeta de crédito/débito, débito inmediato
- Devoluciones: hasta 30 días corridos desde la recepción, producto en buen estado sin uso
- Cuidado del mate: explicá cómo curar un mate nuevo, cómo limpiar bombillas, etc.
- Proceso de compra: seleccionar producto → agregar al carrito → checkout → pago con Mercado Pago

Respondé siempre en español, de manera amable y concisa. Máximo 3 oraciones por respuesta salvo que necesites más detalle. Si la pregunta es muy específica de un pedido en particular, derivá a contacto@matesaconcagua.com.ar.`;

app.post("/make-server-a8bad502/ai/chat", async (c) => {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) {
    return c.json({ error: 'IA no configurada. Agregá ANTHROPIC_API_KEY a las variables de entorno.' }, 500);
  }

  try {
    const { messages } = await c.req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return c.json({ error: 'Mensajes inválidos' }, 400);
    }

    const anthropic = new Anthropic({ apiKey });

    return stream(c, async (s) => {
      const anthropicStream = anthropic.messages.stream({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system: CHAT_SYSTEM_PROMPT,
        messages: messages.map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'assistant',
          content: String(m.content),
        })),
      });

      for await (const event of anthropicStream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          await s.write(event.delta.text);
        }
      }
    });
  } catch (error) {
    console.log(`AI chat error: ${error}`);
    return c.json({ error: 'Error interno del asistente' }, 500);
  }
});

app.post("/make-server-a8bad502/ai/generate-description", async (c) => {
  const user = await requireAdmin(c);
  if (!user) return c.json({ error: 'Forbidden' }, 403);

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) {
    return c.json({ error: 'IA no configurada' }, 500);
  }

  try {
    const { name, category, price, variants } = await c.req.json();
    const categoryMap: Record<string, string> = {
      mates: 'mate', bombillas: 'bombilla', yerba: 'yerba mate', accesorios: 'accesorio'
    };
    const variantText = variants?.length ? `Variantes disponibles: ${variants.join(', ')}.` : '';

    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: `Generá dos descripciones en español para un producto de una tienda de mates argentina:
Nombre: "${name}"
Tipo: ${categoryMap[category] ?? category}
Precio: $${price} ARS
${variantText}

Respondé SOLO con JSON, sin texto adicional, en este formato exacto:
{
  "short": "descripción corta de 1 oración (máx 120 caracteres)",
  "full": "descripción completa de 3-4 oraciones destacando calidad, materiales y beneficios"
}`,
      }],
    });

    const raw = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Respuesta inválida de la IA');

    const parsed = JSON.parse(jsonMatch[0]);
    return c.json({ short: parsed.short, full: parsed.full });
  } catch (error) {
    console.log(`Generate description error: ${error}`);
    return c.json({ error: 'Error al generar descripción' }, 500);
  }
});

// ── Emails (Resend) ────────────────────────────────────────────────────────

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    console.log('RESEND_API_KEY no configurado — email no enviado');
    return false;
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Mates Aconcagua <onboarding@resend.dev>',
        to: [to],
        reply_to: 'enzocanepa156@gmail.com',
        subject,
        html,
      }),
    });
    const data = await res.json();
    if (!res.ok) console.log(`Resend error: ${JSON.stringify(data)}`);
    return res.ok;
  } catch (err) {
    console.log(`Email send error: ${err}`);
    return false;
  }
}

function welcomeEmailHtml(name: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
    <div style="background:#4a5f2f;padding:32px 40px;text-align:center">
      <h1 style="color:#c7e47d;margin:0;font-size:24px">Mates Aconcagua</h1>
      <p style="color:#a8c95f;margin:8px 0 0;font-size:14px">La tradición en tus manos</p>
    </div>
    <div style="padding:40px">
      <h2 style="color:#1f2937;margin:0 0 16px">¡Bienvenido/a, ${name}! 🧉</h2>
      <p style="color:#4b5563;line-height:1.6;margin:0 0 20px">
        Tu cuenta en Mates Aconcagua fue creada exitosamente. Ya podés explorar nuestro catálogo
        de mates artesanales, bombillas y yerbas premium.
      </p>
      <a href="https://matesaconcagua.com.ar/tienda"
         style="display:inline-block;background:#a8c95f;color:#4a5f2f;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">
        Explorar el catálogo
      </a>
      <p style="color:#9ca3af;font-size:13px;margin:32px 0 0">
        ¿Tenés alguna duda? Escribinos a <a href="mailto:contacto@matesaconcagua.com.ar" style="color:#6b8e3d">contacto@matesaconcagua.com.ar</a>
      </p>
    </div>
    <div style="background:#f3f4f6;padding:20px 40px;text-align:center">
      <p style="color:#9ca3af;font-size:12px;margin:0">© 2026 Mates Aconcagua. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>`;
}

function orderConfirmationEmailHtml(order: any): string {
  const itemRows = order.items.map((item: any) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#374151">${item.name} × ${item.quantity}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:right;color:#374151;font-weight:600">
        $${(item.price * item.quantity).toLocaleString('es-AR')}
      </td>
    </tr>`).join('');

  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
    <div style="background:#4a5f2f;padding:32px 40px;text-align:center">
      <h1 style="color:#c7e47d;margin:0;font-size:24px">¡Pedido confirmado! ✅</h1>
      <p style="color:#a8c95f;margin:8px 0 0;font-size:13px">Mates Aconcagua</p>
    </div>
    <div style="padding:40px">
      <p style="color:#4b5563;line-height:1.6;margin:0 0 24px">
        Gracias por tu compra. Tu pedido está siendo preparado y recibirás novedades sobre el envío pronto.
      </p>
      <div style="background:#f9fafb;border-radius:8px;padding:20px;margin-bottom:24px">
        <p style="color:#6b7280;font-size:13px;margin:0 0 4px">Número de pedido</p>
        <p style="color:#111827;font-family:monospace;font-size:14px;margin:0">${order.id}</p>
      </div>
      <table style="width:100%;border-collapse:collapse">
        ${itemRows}
      </table>
      <div style="border-top:2px solid #e5e7eb;margin-top:12px;padding-top:12px;display:flex;justify-content:space-between">
        <strong style="color:#111827;font-size:16px">Total</strong>
        <strong style="color:#4a5f2f;font-size:18px">$${order.total.toLocaleString('es-AR')}</strong>
      </div>
      <a href="https://matesaconcagua.com.ar/pedidos"
         style="display:inline-block;margin-top:28px;background:#a8c95f;color:#4a5f2f;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px">
        Ver mis pedidos
      </a>
    </div>
    <div style="background:#f3f4f6;padding:20px 40px;text-align:center">
      <p style="color:#9ca3af;font-size:12px;margin:0">© 2026 Mates Aconcagua · <a href="mailto:contacto@matesaconcagua.com.ar" style="color:#6b8e3d">contacto@matesaconcagua.com.ar</a></p>
    </div>
  </div>
</body>
</html>`;
}

Deno.serve(app.fetch);
