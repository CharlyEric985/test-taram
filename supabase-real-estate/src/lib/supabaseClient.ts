import { createClient } from "@supabase/supabase-js";

// Récupère l'URL et la clé depuis les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Crée le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
