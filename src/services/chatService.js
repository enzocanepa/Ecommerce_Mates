import { getBaseUrl } from './api';
export const chatService = {
    async sendMessage(message, history, token) {
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        };
        const res = await fetch(`${getBaseUrl()}/ai/chat`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ message, history }),
        });
        if (!res.ok) {
            throw new Error(`Chat error: ${res.status}`);
        }
        return res;
    },
    async generateDescription(productName, category, token) {
        const res = await fetch(`${getBaseUrl()}/ai/generate-description`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productName, category }),
        });
        if (!res.ok)
            throw new Error('Error generando descripción');
        return res.json();
    },
};
