import { createClient } from "@supabase/supabase-js";

// Supabase project credentials (provided)
const SUPABASE_URL = "https://opzpkztpbimqtesdwokp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wenBrenRwYmltcXRlc2R3b2twIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3MTY3MzksImV4cCI6MjA3ODI5MjczOX0.X0yz65v_aUMAcZPj6Kbt0UQ7tL65Qw220jCDY9Hlci4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
