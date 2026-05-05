import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Bot, User } from 'lucide-react';

// URL de tu Webhook en n8n (¡Recuerda cambiarla por la tuya!)
const N8N_WEBHOOK_URL = 'https://n8n.66.94.104.64.nip.io/webhook/chat-ecommerce';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const WELCOME: Message = {
  id: 'welcome',
  role: 'assistant',
  content: '¡Hola! Soy el asistente virtual de Mates Aconcagua 🧉 ¿En qué puedo ayudarte hoy? Puedo responder preguntas sobre productos, envíos, pagos y más.',
};

const QUICK_QUESTIONS = [
  '¿Cómo cuido mi mate?',
  '¿Cuánto tarda el envío?',
  '¿Cómo pago?',
  '¿Aceptan devoluciones?',
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll al final cuando hay nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Auto-focus en el input al abrir el chat
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    // 1. Agregamos el mensaje del usuario a la pantalla
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // 2. Enviamos el mensaje a n8n
    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatInput: trimmed }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      // 3. Mostramos la respuesta de la IA
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Lo siento, no pude procesar tu mensaje.',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Error al conectar con n8n:", err);
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Ups, tuvimos un problema de conexión con el servidor. Por favor, intenta de nuevo.',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Ventana del Chat */}
      <div
        className={`absolute bottom-20 right-0 w-80 sm:w-96 flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{ height: '520px' }}
      >
        {/* Header */}
        <div className="bg-[#4a5f2f] text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#a8c95f] flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#4a5f2f]" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">Asistente Aconcagua</p>
              <p className="text-xs text-white/60 mt-0.5">En línea</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Área de Mensajes */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                msg.role === 'user' ? 'bg-[#c7e47d]' : 'bg-[#4a5f2f]'
              }`}>
                {msg.role === 'user'
                  ? <User className="w-3.5 h-3.5 text-[#4a5f2f]" />
                  : <Bot className="w-3.5 h-3.5 text-white" />
                }
              </div>
              <div
                className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#a8c95f] text-[#2d3e1a] rounded-tr-sm'
                    : 'bg-white text-gray-800 shadow-sm rounded-tl-sm'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Indicador de "Escribiendo..." (Bouncing dots) */}
          {loading && (
            <div className="flex gap-2 flex-row">
              <div className="w-7 h-7 rounded-full bg-[#4a5f2f] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="max-w-[78%] px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-white text-gray-800 shadow-sm text-sm leading-relaxed flex items-center h-10">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Preguntas Rápidas */}
        {messages.length === 1 && !loading && (
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex-shrink-0">
            <p className="text-xs text-gray-400 mb-2">Preguntas frecuentes:</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full hover:border-[#a8c95f] hover:text-[#4a5f2f] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="px-3 py-3 bg-white border-t border-gray-100 flex gap-2 flex-shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribí tu consulta..."
            disabled={loading}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm outline-none focus:border-[#a8c95f] focus:ring-1 focus:ring-[#a8c95f] disabled:bg-gray-50 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-full bg-[#4a5f2f] hover:bg-[#3a4f22] text-white flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Botón Flotante para abrir/cerrar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#4a5f2f] hover:bg-[#3a4f22] text-white shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center"
        aria-label="Abrir chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}