export function logEnvConfig() {
  console.group("[ENV] FIAE Lernplattform config");
  console.log(
    "VITE_SUPABASE_URL:",
    import.meta.env.VITE_SUPABASE_URL ?? "<missing>"
  );
  console.log(
    "VITE_SUPABASE_ANON_KEY:",
    import.meta.env.VITE_SUPABASE_ANON_KEY ? "<set>" : "<missing>"
  );
  console.log(
    "VITE_GEMINI_API_KEY:",
    import.meta.env.VITE_GEMINI_API_KEY ? "<set>" : "<missing>"
  );
  console.groupEnd();
}
