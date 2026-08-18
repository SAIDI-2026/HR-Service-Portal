import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sbfjvntwfjahhbnliuap.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiZmp2bnR3ZmphaGhibmxpdWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NTgzOTAsImV4cCI6MjA3MDEzNDM5MH0.ZpD3M5PuT3o-eRnqCmg_UnOMA-pCAJaCdmG4DEG9exs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);