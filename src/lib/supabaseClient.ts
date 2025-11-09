import { createClient } from "@supabase/supabase-js";

// Use Vite environment variables. Create a .env (or set CI) with:
// VITE_SUPABASE_URL=your-project-url
// VITE_SUPABASE_ANON_KEY=your-anon-key

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	// In development it's helpful to warn if env vars are missing.
	// Do not throw so the app still starts; operations will fail with clearer errors.
	// eslint-disable-next-line no-console
	console.warn("Supabase environment variables are not set. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.");
}

export const supabase = createClient(SUPABASE_URL || "", SUPABASE_ANON_KEY || "");
