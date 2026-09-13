import { createClient } from '@supabase/supabase-js';

// Try loading from environment variables or custom local storage setting
const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('agenda_supabase_url') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('agenda_supabase_key') : null;

  const url = envUrl || localUrl;
  const key = envKey || localKey;

  const isConfigured = Boolean(url && key && url.includes('supabase.co') && key.length > 20);

  return { url, key, isConfigured };
};

const config = getSupabaseConfig();

export const supabase = config.isConfigured
  ? createClient(config.url, config.key)
  : null;

export const getCloudSyncStatus = () => {
  const { isConfigured, url } = getSupabaseConfig();
  return {
    isConfigured,
    url: url || null
  };
};

export const saveCustomSupabaseConfig = (url, key) => {
  if (url && key) {
    localStorage.setItem('agenda_supabase_url', url.trim());
    localStorage.setItem('agenda_supabase_key', key.trim());
    window.location.reload();
  }
};

export const clearCustomSupabaseConfig = () => {
  localStorage.removeItem('agenda_supabase_url');
  localStorage.removeItem('agenda_supabase_key');
  window.location.reload();
};
