import { Outlet } from 'react-router';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import ChatWidget from '../components/chat/ChatWidget';
import { Toaster } from 'sonner';
export function Layout() {
    return (<div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
      <Toaster position="bottom-right" richColors toastOptions={{ duration: 3000 }}/>
    </div>);
}
