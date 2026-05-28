// Servicio para centralizar los envíos de webhooks hacia n8n

const N8N_URLS = {
    bienvenida: 'https://n8n.66.94.104.64.nip.io/webhook/bienvenida',
    carritoAbandonado: 'https://n8n.66.94.104.64.nip.io/webhook/carrito-abandonado',
    compraExitosa: 'https://n8n.66.94.104.64.nip.io/webhook/compra-exitosa',
    compraFallida: 'https://n8n.66.94.104.64.nip.io/webhook/compra-fallida'
};

const enviarWebhook = async (evento, payload) => {
    try {
        const url = N8N_URLS[evento];
        if (!url) return;

        // Petición asíncrona fire-and-forget para no bloquear el flujo de React
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(err => console.error(`Error enviando webhook ${evento}:`, err));
        
    } catch (error) {
        console.error(`Error al preparar el webhook ${evento}:`, error);
    }
};

export const n8nService = {
    enviarBienvenida: (user) => {
        if (!user || !user.email) return;
        enviarWebhook('bienvenida', {
            email: user.email,
            nombre: user.name || user.email.split('@')[0]
        });
    },

    enviarCarritoAbandonado: (user, cart, total) => {
        if (!user || !user.email || cart.length === 0) return;
        enviarWebhook('carritoAbandonado', {
            email: user.email,
            nombre: user.name || user.email.split('@')[0],
            cart_id: user.id + '-' + new Date().getTime(),
            productos: cart,
            total: total
        });
    },

    enviarCompraExitosa: (user, cart, total, orderId) => {
        if (!user || !user.email) return;
        enviarWebhook('compraExitosa', {
            email: user.email,
            nombre: user.name || user.email.split('@')[0],
            order_id: orderId || 'ORD-' + Math.floor(Math.random() * 100000),
            productos: cart,
            total: total,
            metodo_pago: 'Mercado Pago'
        });
    },

    enviarCompraFallida: (user, motivo) => {
        if (!user || !user.email) return;
        enviarWebhook('compraFallida', {
            email: user.email,
            nombre: user.name || user.email.split('@')[0],
            motivo: motivo || 'Pago rechazado o cancelado'
        });
    }
};
