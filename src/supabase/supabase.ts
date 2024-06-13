import { createClient } from "@supabase/supabase-js";

if (!process.env.EXPO_PUBLIC_SUPABASE_KEY) {
  throw new Error("env.EXPO_PUBLIC_SUPABASE_KEY is required");
}
const supabaseUrl = "https://supabase.juliomacedo.dev";
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);
