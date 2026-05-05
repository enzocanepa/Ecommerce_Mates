import { Outlet } from 'react-router';
import { Header } from '../components/Header';
import Chatbot from '../components/Chatbot'; // <-- El nuevo con n8n
import { Toaster } from 'sonner';

export function Layout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Outlet />
      </main>
      <footer className="bg-[#c7e47d] text-[#4a5f2f] py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg mb-2">🧉 Mates Aconcagua - La tradición en tus manos</p>
          <p className="text-sm text-[#6b8e3d]">
            © 2026 Mates Aconcagua. Todos los derechos reservados.
          </p>
        </div>
      </footer>
      
      <Chatbot />
      <Toaster
        position="bottom-right"
        richColors
        toastOptions={{ duration: 3000 }}
      />
    </div>
  );
}
