import { createBrowserRouter } from 'react-router';
import { lazy, Suspense } from 'react';
// ── Eager: rutas del flujo principal (se cargan siempre) ──────────────────
import { Layout } from '../pages/Layout';
import { Home } from '../pages/Home';
import { Shop } from '../pages/Shop';
import { Cart } from '../pages/Cart';
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { NotFound } from '../pages/NotFound';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { AdminRoute } from '../components/auth/AdminRoute';
// ── Lazy: rutas secundarias y admin (reducen bundle inicial ~35%) ─────────
const About = lazy(() => import('../pages/About').then(m => ({ default: m.About })));
const ProductDetail = lazy(() => import('../pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Orders = lazy(() => import('../pages/Orders').then(m => ({ default: m.Orders })));
const Checkout = lazy(() => import('../pages/Checkout').then(m => ({ default: m.Checkout })));
const CheckoutResult = lazy(() => import('../pages/CheckoutResult').then(m => ({ default: m.CheckoutResult })));
const AdminLayout = lazy(() => import('../pages/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminProducts = lazy(() => import('../pages/admin/AdminProducts').then(m => ({ default: m.AdminProducts })));
const AdminOrders = lazy(() => import('../pages/admin/AdminOrders').then(m => ({ default: m.AdminOrders })));
function LazyPage({ children }) {
    return (<Suspense fallback={<div style={{ minHeight: '60vh' }}/>}>
      {children}
    </Suspense>);
}
export const router = createBrowserRouter([
    {
        path: '/',
        Component: Layout,
        children: [
            { index: true, Component: Home },
            { path: 'tienda', Component: Shop },
            { path: 'carrito', Component: Cart },
            { path: 'login', Component: Login },
            { path: 'registro', Component: Signup },
            {
                path: 'producto/:id',
                element: <LazyPage><ProductDetail /></LazyPage>,
            },
            {
                path: 'acerca',
                element: <LazyPage><About /></LazyPage>,
            },
            {
                path: 'pedidos',
                element: (<ProtectedRoute>
            <LazyPage><Orders /></LazyPage>
          </ProtectedRoute>),
            },
            {
                path: 'checkout',
                element: (<ProtectedRoute>
            <LazyPage><Checkout /></LazyPage>
          </ProtectedRoute>),
            },
            {
                path: 'checkout/exito',
                element: <LazyPage><CheckoutResult /></LazyPage>,
            },
            {
                path: 'checkout/error',
                element: <LazyPage><CheckoutResult /></LazyPage>,
            },
            {
                path: 'checkout/pendiente',
                element: <LazyPage><CheckoutResult /></LazyPage>,
            },
            { path: '*', Component: NotFound },
        ],
    },
    {
        path: '/admin',
        element: (<AdminRoute>
        <LazyPage>
          <AdminLayout />
        </LazyPage>
      </AdminRoute>),
        children: [
            { index: true, Component: AdminDashboard },
            { path: 'productos', Component: AdminProducts },
            { path: 'pedidos', Component: AdminOrders },
        ],
    },
]);
