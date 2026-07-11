import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. Copia .env.example a .env y complétalo con los datos de tu proyecto Supabase.'
  );
}

// La anon key es pública a propósito (se usa en el navegador) — la seguridad real
// la da Row Level Security (RLS) en las tablas, no el secreto de esta key.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
