import { supabase } from "./supabaseClient";

export async function testSupabaseConnection() {
  console.log("[Supabase test] starting...");

  const { data, error } = await supabase
    .from("debug_notes")
    .select("*")
    .limit(5);

  if (error) {
    console.error("[Supabase test] ERROR:", error);
  } else {
    console.log("[Supabase test] OK, rows:", data);
  }
}
