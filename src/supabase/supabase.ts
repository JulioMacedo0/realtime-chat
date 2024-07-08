import { createClient } from "@supabase/supabase-js";
import { Database } from "./Tsupabase";
import * as Crypto from "expo-crypto";
if (!process.env.EXPO_PUBLIC_SUPABASE_KEY) {
  throw new Error("env.EXPO_PUBLIC_SUPABASE_KEY is required");
}

if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
  throw new Error("env.EXPO_PUBLIC_SUPABASE_URL is required");
}

if (!process.env.EXPO_PUBLIC_SUPABASE_CHAT_BUCKET) {
  throw new Error("env.EXPO_PUBLIC_SUPABASE_CHAT_BUCKET is required");
}
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
export const USER_ID = Crypto.randomUUID();
