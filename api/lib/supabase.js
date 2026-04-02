import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
// Priorizamos a SERVICE_ROLE_KEY para operações administrativas que ignoram RLS
const supabaseServiceKey = 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  process.env.SUPABASE_SERVICE_KEY || 
  process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('[Supabase] Erro: SUPABASE_URL ou chaves de acesso não configuradas.');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);