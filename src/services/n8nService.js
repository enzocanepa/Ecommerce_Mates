// M-06: URLs cargadas desde variables de entorno, no hardcodeadas en el código
const N8N_URLS = {
    bienvenida:        import.meta.env.VITE_N8N_BIENVENIDA_URL,
    carritoAbandonado: import.meta.env.VITE_N8N_CARRITO_URL,
    compraExitosa:     import.meta.env.VITE_N8N_COMPRA_EXITOSA_URL,
    compraFallida:     import.meta.env.VITE_N8N_COMPRA_FALLIDA_URL,
};

const enviarWebhook = async (evento, payload) => {
    try {
        const url = N8N_URLS[evento];
        if (!url) return;

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
