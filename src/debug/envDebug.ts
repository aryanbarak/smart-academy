export const logEnvConfig = (): void => {
  if (import.meta.env.PROD) return;

  console.groupCollapsed("[ENV] FIAE Lernplattform config");
  console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL || "<missing>");
  console.log(
    "VITE_SUPABASE_ANON_KEY:",
    import.meta.env.VITE_SUPABASE_ANON_KEY ? "<set>" : "<missing>"
  );
  console.log(
    "VITE_GEMINI_API_KEY:",
    import.meta.env.VITE_GEMINI_API_KEY ? "<set>" : "<missing>"
  );
  console.groupEnd();
};
