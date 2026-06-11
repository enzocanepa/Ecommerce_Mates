import { Hono } from "npm:hono";
import { requireAuth } from "../middleware/auth.ts";

const checkoutRoutes = new Hono();

checkoutRoutes.post("/create-preference", async (c) => {
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
      auto_return: 'all',
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

export { checkoutRoutes };
