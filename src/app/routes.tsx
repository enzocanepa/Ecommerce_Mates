import { createBrowserRouter } from 'react-router';
import { Layout } from './pages/Layout';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Cart } from './pages/Cart';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Orders } from './pages/Orders';
import { ProductDetail } from './pages/ProductDetail';
import { Checkout } from './pages/Checkout';
import { CheckoutResult } from './pages/CheckoutResult';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AdminRoute } from './components/auth/AdminRoute';
import { NotFound } from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'tienda', Component: Shop },
      { path: 'producto/:id', Component: ProductDetail },
      { path: 'carrito', Component: Cart },
      { path: 'acerca', Component: About },
      { path: 'login', Component: Login },
      { path: 'registro', Component: Signup },
      {
        path: 'pedidos',
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout/exito',
        element: (
          <ProtectedRoute>
            <CheckoutResult />
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout/error',
        element: (
          <ProtectedRoute>
            <CheckoutResult />
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout/pendiente',
        element: (
          <ProtectedRoute>
            <CheckoutResult />
          </ProtectedRoute>
        ),
      },
      { path: '*', Component: NotFound },
    ],
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, Component: AdminDashboard },
      { path: 'productos', Component: AdminProducts },
      { path: 'pedidos', Component: AdminOrders },
    ],
  },
]);
