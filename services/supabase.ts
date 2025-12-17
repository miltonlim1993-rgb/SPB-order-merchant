import { createClient, SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null;

const safeGetEnv = (name: string): string | undefined => {
  try {
    // Vite-style env
    const viteVal = (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[name]) as string | undefined;
    if (viteVal) return viteVal;
  } catch {}
  // Window-scoped fallbacks
  const w = typeof window !== 'undefined' ? (window as any) : (globalThis as any);
  if (w && typeof w[name] === 'string') return w[name];
  if (w && w.__ENV__ && typeof w.__ENV__[name] === 'string') return w.__ENV__[name];
  if (name === 'VITE_SUPABASE_URL' && typeof w.__SUPABASE_URL === 'string') return w.__SUPABASE_URL;
  if (name === 'VITE_SUPABASE_ANON_KEY' && typeof w.__SUPABASE_ANON_KEY === 'string') return w.__SUPABASE_ANON_KEY;
  return undefined;
};

export const isSupabaseConfigured = () => {
  const url = safeGetEnv('VITE_SUPABASE_URL');
  const key = safeGetEnv('VITE_SUPABASE_ANON_KEY');
  return !!url && !!key;
};

export const getSupabase = () => {
  if (!isSupabaseConfigured()) return null;
  if (cached) return cached;
  const url = safeGetEnv('VITE_SUPABASE_URL') as string;
  const key = safeGetEnv('VITE_SUPABASE_ANON_KEY') as string;
  cached = createClient(url, key);
  return cached;
};
