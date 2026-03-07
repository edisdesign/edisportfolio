import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ysnnrtsialyohiazkcvh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlzbm5ydHNpYWx5b2hpYXprY3ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MjYwNTUsImV4cCI6MjA4ODUwMjA1NX0.HKIzX-g7PDiNc0-7E5-SlfPjBKhmX5JHBFfa_4fRQ0M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
