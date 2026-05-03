export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
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

export function welcomeEmailHtml(name: string): string {
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

export function orderConfirmationEmailHtml(order: any): string {
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
