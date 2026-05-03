import { Hono } from "npm:hono";
import { stream } from "npm:hono/streaming";
import Anthropic from "npm:@anthropic-ai/sdk";
import { requireAdmin } from "../middleware/auth.ts";

const aiRoutes = new Hono();

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

aiRoutes.post("/chat", async (c) => {
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

aiRoutes.post("/generate-description", async (c) => {
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

export { aiRoutes };
