import { createContext, useContext, useState, useEffect } from 'react';
import { getBaseUrl } from '../services/api';

const API = getBaseUrl(); // B-04: usar getBaseUrl() centralizado
const SESSION_KEY = 'mate_session'; // B-06: clave unificada

const AuthContext = createContext(undefined);

// M-05: verificar si el JWT expiró sin librerías externas
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function loadSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (!session?.token || !session?.user) return null;
    if (isTokenExpired(session.token)) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
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
    if (session) {
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
