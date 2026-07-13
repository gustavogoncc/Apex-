import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// O "export" antes do const é obrigatório para que a tela de login consiga importá-lo
export const supabase = createClient(supabaseUrl, supabaseAnonKey);