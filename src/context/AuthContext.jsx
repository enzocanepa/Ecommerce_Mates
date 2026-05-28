import { createContext, useContext, useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL;
const SESSION_KEY = 'mate_session';

const AuthContext = createContext(undefined);

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const session = loadSession();
    if (session?.token && session?.user) {
      setAccessToken(session.token);
      setUser(session.user);
    }
    setLoading(false);
  }, []);

  function saveSession(token, userData) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ token, user: userData }));
    setAccessToken(token);
    setUser(userData);
  }

  const signUp = async (email, password, name) => {
    const res = await fetch(`${API}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al registrarse');
    saveSession(data.token, data.user);
    
    // N8N Webhook: Correo de Bienvenida
    import('../services/n8nService').then(({ n8nService }) => {
      n8nService.enviarBienvenida(data.user);
    }).catch(err => console.error(err));

    return { needsConfirmation: false };
  };

  const signIn = async (email, password) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Email o contraseña incorrectos');
    saveSession(data.token, data.user);
  };

  const signOut = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      accessToken,
      loading,
      signUp,
      signIn,
      signOut,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
