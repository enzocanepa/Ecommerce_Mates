import { Component } from 'react';

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught:', error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1rem', padding: '2rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Algo salió mal</h2>
                    <p style={{ color: '#6b7280' }}>Ocurrió un error inesperado. Intentá recargar la página.</p>
                    <button
                        onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
                        style={{ padding: '0.5rem 1.5rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontWeight: 600 }}
                    >
                        Volver al inicio
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
