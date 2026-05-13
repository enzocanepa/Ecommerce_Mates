import { Navigate } from 'react-router';
import { useAuth } from '../../context/AuthContext';
export function AdminRoute({ children }) {
    const { user, loading, isAdmin } = useAuth();
    if (loading) {
        return (<div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-[#a8c95f] border-t-transparent rounded-full animate-spin"/>
      </div>);
    }
    if (!user)
        return <Navigate to="/login" replace/>;
    if (!isAdmin)
        return <Navigate to="/" replace/>;
    return <>{children}</>;
}
