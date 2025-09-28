import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://jbztzycvdsehcystocnt.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpienR6eWN2ZHNlaGN5c3RvY250Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MDYxMzIsImV4cCI6MjA3NDQ4MjEzMn0.paHUO9k_8zOntLGXyeeXKJJd6thgrPQEVU_8U5ATx-g";
export const db = createClient(supabaseUrl, supabaseKey);
