import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = 'https://albbftgsplpqepfhtllv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsYmJmdGdzcGxwcWVwZmh0bGx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5Mjg3MTcsImV4cCI6MjA1NDUwNDcxN30.1Z4P5CbH1aI5RXi277nyvSanN3iauKTR3XmHj9JhMS4';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);