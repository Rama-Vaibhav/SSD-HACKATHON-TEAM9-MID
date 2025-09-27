import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://loitefapfcpmhcoqxxof.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvaXRlZmFwZmNwbWhjb3F4eG9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NjU0OTUsImV4cCI6MjA3NDQ0MTQ5NX0.CiyRpEJuSqJ-0UiFNNV8lVjc-KMsQQlkkEcXYxQbzQE";
export const db = createClient(supabaseUrl, supabaseKey);
