import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ needsConfirmation: boolean }>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Local auth fallback (used when Supabase is unreachable) ─────────────────
const LOCAL_USERS_KEY = 'mate_local_users';
const LOCAL_SESSION_KEY = 'mate_local_session';

interface LocalUserRecord {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

function getLocalUsers(): LocalUserRecord[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function isNetworkError(err: any): boolean {
  return (
    err?.message === 'Failed to fetch' ||
    err?.message?.includes('fetch') ||
    err instanceof TypeError
  );
}

// ── Supabase user builder ────────────────────────────────────────────────────

function buildUser(supabaseUser: any): User {
  const role: UserRole =
    supabaseUser.user_metadata?.role === 'admin' ? 'admin' : 'user';
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    name: supabaseUser.user_metadata?.name,
    role,
  };
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          setAccessToken(session.access_token);
          setUser(buildUser(session.user));
          setLoading(false);
          return;
        }
      } catch {
        // Supabase unreachable — fall through to local session
      }

      // Local session fallback
      try {
        const stored = localStorage.getItem(LOCAL_SESSION_KEY);
        if (stored) setUser(JSON.parse(stored));
      } catch { /* ignore */ }

      setLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.access_token) {
          setAccessToken(session.access_token);
          setUser(buildUser(session.user));
        } else {
          // Don't clear user here — might be using local session
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role: 'user' } },
      });

      if (error) {
        if (isNetworkError(error)) throw { __network: true };
        throw error;
      }

      if (data.session) {
        setAccessToken(data.session.access_token);
        setUser(buildUser(data.user!));
        return { needsConfirmation: false };
      }
      return { needsConfirmation: true };
    } catch (err: any) {
      if (!err?.__network && !isNetworkError(err)) throw err;

      // ── Local fallback ──
      const users = getLocalUsers();
      if (users.some(u => u.email === email)) {
        throw new Error('Ya existe una cuenta con ese email. Iniciá sesión.');
      }
      const newUser: LocalUserRecord = {
        id: crypto.randomUUID(),
        email,
        password,
        name,
        role: 'user',
      };
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify([...users, newUser]));
      const sessionUser: User = { id: newUser.id, email, name, role: 'user' };
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
      return { needsConfirmation: false };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (isNetworkError(error)) throw { __network: true };
        throw error;
      }

      if (session?.access_token) {
        setAccessToken(session.access_token);
        setUser(buildUser(session.user));
      }
    } catch (err: any) {
      if (!err?.__network && !isNetworkError(err)) throw err;

      // ── Local fallback ──
      const users = getLocalUsers();
      const found = users.find(u => u.email === email && u.password === password);
      if (!found) {
        throw new Error('Email o contraseña incorrectos.');
      }
      const sessionUser: User = { id: found.id, email: found.email, name: found.name, role: found.role };
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch { /* ignore if unreachable */ }
    localStorage.removeItem(LOCAL_SESSION_KEY);
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        signUp,
        signIn,
        signOut,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
