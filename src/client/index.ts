import { createClient } from "@supabase/supabase-js";

export default createClient(
  import.meta.env.VITE_APP_SUPABASE_CLIENT,
  import.meta.env.VITE_APP_SUPABASE_KEY
);
