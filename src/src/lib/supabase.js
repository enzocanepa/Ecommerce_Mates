import { createClient } from '@supabase/supabase-js';
const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
if (!projectId || !anonKey) {
    throw new Error('Faltan variables de entorno de Supabase. Revisá tu archivo .env');
}
export const supabaseUrl = `https://${projectId}.supabase.co`;
export const supabaseAnonKey = anonKey;
export const supabase = createClient(supabaseUrl, anonKey);
