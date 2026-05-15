import { RouterProvider } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductsProvider } from './context/ProductsContext';
import { router } from './routes/AppRouter';
import ErrorBoundary from './components/common/ErrorBoundary';

export default function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <ProductsProvider>
                    <CartProvider>
                        <RouterProvider router={router}/>
                    </CartProvider>
                </ProductsProvider>
            </AuthProvider>
        </ErrorBoundary>
    );
}
