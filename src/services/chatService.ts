import { getBaseUrl } from './api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const chatService = {
  async sendMessage(
    message: string,
    history: ChatMessage[],
    token?: string | null,
  ): Promise<Response> {
    const headers: HeadersInit = {
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

  async generateDescription(
    productName: string,
    category: string,
    token: string,
  ): Promise<{ description: string; fullDescription: string }> {
    const res = await fetch(`${getBaseUrl()}/ai/generate-description`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productName, category }),
    });

    if (!res.ok) throw new Error('Error generando descripción');
    return res.json();
  },
};
