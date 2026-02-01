import { createClient } from '@supabase/supabase-js';

// Specific keys provided
const supabaseUrl = 'https://fxdmipjjhfrnvraafbjd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4ZG1pcGpqaGZybnZyYWFmYmpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MjY1NDIsImV4cCI6MjA4NTUwMjU0Mn0.WTMXedt7JuF1giOTRjKlzxwFRM_hEOfNQ1NHuDeTNaU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
