import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Bot, User } from 'lucide-react';
import { getBaseUrl } from '../../services/api';
const WELCOME = {
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
function getFallbackResponse(text) {
    const t = text.toLowerCase();
    if (t.includes('curar') || t.includes('cuido') || t.includes('cuidar') || t.includes('mate nuevo')) {
        return 'Para curar tu mate nuevo: llenalo con yerba húmeda hasta el borde y dejalo 24 hs. Luego vaciá raspando suavemente las paredes con una cuchara. Repetí 2-3 veces. Así el mate desarrolla su sabor y dura muchos años. 🧉';
    }
    if (t.includes('envío') || t.includes('envio') || t.includes('tarda') || t.includes('demora') || t.includes('llega') || t.includes('entrega')) {
        return 'El envío es GRATIS en todos los pedidos 🎉 CABA y GBA: 24-48hs. Interior del país: 3 a 7 días hábiles.';
    }
    if (t.includes('pago') || t.includes('pagar') || t.includes('tarjeta') || t.includes('mercado pago') || t.includes('abono')) {
        return 'Aceptamos Mercado Pago: podés pagar con tarjeta de crédito, débito o saldo en cuenta MP. El proceso es 100% seguro. 💳';
    }
    if (t.includes('devoluci') || t.includes('cambio') || t.includes('devolver') || t.includes('retorno')) {
        return 'Tenés 30 días corridos desde que recibís tu pedido para hacer devoluciones o cambios. El producto debe estar en buen estado y sin uso. Escribinos a contacto@matesaconcagua.com.ar 📬';
    }
    if (t.includes('precio') || t.includes('cuesta') || t.includes('cuánto vale') || t.includes('cuanto vale') || t.includes('valor')) {
        return 'Los precios van de $1.100 a $15.000 ARS según tipo y material. Mates desde $1.100, bombillas desde $1.800, yerbas premium desde $1.100. ¡Explorá el catálogo! 🛒';
    }
    if (t.includes('bombilla')) {
        return 'Tenemos bombillas de alpaca, acero inoxidable, plata y bambú. Las de alpaca son las más populares por su durabilidad y precio. Limpiálas después de cada uso para que duren más. ✨';
    }
    if (t.includes('yerba')) {
        return 'Ofrecemos yerbas premium, orgánica, compuesta y barbacuá, todas seleccionadas por calidad. Para empezar, te recomendamos la yerba premium tradicional. 🌿';
    }
    if (t.includes('hola') || t.includes('buenas') || t.includes('buen dia') || t.includes('buenas tardes') || t.includes('buenas noches')) {
        return '¡Hola! ¿En qué te puedo ayudar? Podés preguntarme sobre productos, envíos, pagos o cómo cuidar tu mate. 🧉';
    }
    return 'Para consultas específicas sobre tu pedido, escribinos a contacto@matesaconcagua.com.ar y te respondemos a la brevedad. 📩';
}
const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([WELCOME]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [streamingContent, setStreamingContent] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingContent]);
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);
    async function sendMessage(text) {
        const trimmed = text.trim();
        if (!trimmed || loading)
            return;
        const userMsg = { id: Date.now().toString(), role: 'user', content: trimmed };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput('');
        setLoading(true);
        setStreamingContent('');
        const history = updatedMessages
            .filter((m) => m.id !== 'welcome')
            .slice(-10)
            .map((m) => ({ role: m.role, content: m.content }));
        try {
            const res = await fetch(`${getBaseUrl()}/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: history }),
            });
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            const reader = res.body?.getReader();
            const decoder = new TextDecoder();
            let fullContent = '';
            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done)
                        break;
                    const chunk = decoder.decode(value, { stream: true });
                    fullContent += chunk;
                    setStreamingContent(fullContent);
                }
            }
            const assistantMsg = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: fullContent || 'Lo siento, no pude procesar tu mensaje.',
            };
            setMessages((prev) => [...prev, assistantMsg]);
        }
        catch (err) {
            // Edge Function unavailable — use local FAQ fallback
            const fallback = getFallbackResponse(trimmed);
            const fallbackMsg = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: fallback,
            };
            setMessages((prev) => [...prev, fallbackMsg]);
        }
        finally {
            setLoading(false);
            setStreamingContent('');
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };
    return (<div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {/* Chat window */}
      <div className={`absolute bottom-20 right-0 w-80 sm:w-96 flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ease-in-out origin-bottom-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`} style={{ height: '520px' }}>
        {/* Header */}
        <div className="bg-[#4a5f2f] text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#a8c95f] flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#4a5f2f]"/>
            </div>
            <div>
              <p className="text-sm font-semibold leading-none">Asistente Aconcagua</p>
              <p className="text-xs text-white/60 mt-0.5">En línea</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
          {messages.map((msg) => (<div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${msg.role === 'user' ? 'bg-[#c7e47d]' : 'bg-[#4a5f2f]'}`}>
                {msg.role === 'user'
                ? <User className="w-3.5 h-3.5 text-[#4a5f2f]"/>
                : <Bot className="w-3.5 h-3.5 text-white"/>}
              </div>
              <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                ? 'bg-[#a8c95f] text-[#2d3e1a] rounded-tr-sm'
                : 'bg-white text-gray-800 shadow-sm rounded-tl-sm'}`}>
                {msg.content}
              </div>
            </div>))}

          {/* Streaming / typing indicator */}
          {loading && (<div className="flex gap-2 flex-row">
              <div className="w-7 h-7 rounded-full bg-[#4a5f2f] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-white"/>
              </div>
              <div className="max-w-[78%] px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-white text-gray-800 shadow-sm text-sm leading-relaxed">
                {streamingContent || (<span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]"/>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"/>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"/>
                  </span>)}
              </div>
            </div>)}

          <div ref={messagesEndRef}/>
        </div>

        {/* Quick questions */}
        {messages.length === 1 && !loading && (<div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex-shrink-0">
            <p className="text-xs text-gray-400 mb-2">Preguntas frecuentes:</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_QUESTIONS.map((q) => (<button key={q} onClick={() => sendMessage(q)} className="text-xs bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full hover:border-[#a8c95f] hover:text-[#4a5f2f] transition-colors">
                  {q}
                </button>))}
            </div>
          </div>)}

        {/* Input */}
        <form onSubmit={handleSubmit} className="px-3 py-3 bg-white border-t border-gray-100 flex gap-2 flex-shrink-0">
          <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Escribí tu consulta..." disabled={loading} className="flex-1 px-4 py-2 border border-gray-200 rounded-full text-sm outline-none focus:border-[#a8c95f] focus:ring-1 focus:ring-[#a8c95f] disabled:bg-gray-50 transition-colors"/>
          <button type="submit" disabled={!input.trim() || loading} className="w-9 h-9 rounded-full bg-[#4a5f2f] hover:bg-[#3a4f22] text-white flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <Send className="w-4 h-4"/>
          </button>
        </form>
      </div>

      {/* Toggle button */}
      <button onClick={() => setIsOpen(!isOpen)} className="w-14 h-14 rounded-full bg-[#4a5f2f] hover:bg-[#3a4f22] text-white shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center" aria-label="Abrir chat">
        {isOpen ? (<X className="w-6 h-6"/>) : (<MessageCircle className="w-6 h-6"/>)}
      </button>
    </div>);
};
export default ChatWidget;
