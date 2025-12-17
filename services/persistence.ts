import { AppConfig, MenuItem, Outlet } from '../types';
import { getSupabase, isSupabaseConfigured } from './supabase';

export interface AppState {
  config: AppConfig;
  menuItems: MenuItem[];
  outlets: Outlet[];
}

const LOCAL_KEY = 'spb_app_state';

export const loadAppState = async (): Promise<AppState | null> => {
  let state: AppState | null = null;
  const supa = getSupabase();
  if (supa) {
    const { data, error } = await supa.from('app_state').select('*').eq('id', 'default').single();
    if (error) {
      console.error('Supabase load error', error);
    }
    if (!error && data) {
      state = {
        config: data.config,
        menuItems: data.menuItems,
        outlets: data.outlets,
      };
    }
  }
  
  // If Supabase failed or returned nothing, try localStorage
  if (!state) {
    try {
      const raw = localStorage.getItem(LOCAL_KEY);
      if (raw) state = JSON.parse(raw);
    } catch {}
  }
  
  return state;
};

export const saveAppState = async (state: AppState) => {
  // Always save to localStorage as backup/cache
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  } catch {}

  const supa = getSupabase();
  if (supa) {
    const { error } = await supa
      .from('app_state')
      .upsert(
        {
          id: 'default',
          config: state.config,
          menuItems: state.menuItems,
          outlets: state.outlets,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
    if (error) {
      console.error('Supabase save error', error);
    }
  }
};

export const supabaseAvailable = () => isSupabaseConfigured();

export const subscribeAppState = (onUpdate: (state: AppState) => void) => {
  const supa = getSupabase();
  if (!supa) return () => {};
  const channel = supa
    .channel('app_state_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'app_state', filter: 'id=eq.default' },
      (payload: any) => {
        const row = payload.new || payload.old;
        if (!row) return;
        const state: AppState = {
          config: row.config,
          menuItems: row.menuItems,
          outlets: row.outlets,
        };
        onUpdate(state);
      }
    )
    .subscribe();
  return () => {
    supa.removeChannel(channel);
  };
};
