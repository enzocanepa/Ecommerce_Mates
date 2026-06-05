import { Outlet } from 'react-router';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import ChatWidget from '../components/chat/ChatWidget';
import { Toaster } from 'sonner';
export function Layout() {
    return (<div className="min-h-screen flex flex-col" style={{ background: '#f6f4ec' }}>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <ChatWidget />
      <Toaster position="bottom-right" richColors toastOptions={{ duration: 3000 }}/>
    </div>);
}
