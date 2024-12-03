import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tpiavnkikqioxcbcrmmn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwaWF2bmtpa3Fpb3hjYmNybW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyODE1MjgsImV4cCI6MjA0Nzg1NzUyOH0.H3HQoSgxIF2iI9CmgxsIOQqFJcIlkMQw9YQK0MJ_Kg4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for Supabase tables
export type Database = {
  public: {
    Tables: {
      crops: {
        Row: {
          id: string;
          user_id?: string | null;
          crop_name?: string | null;
          image_url: string;
          disease_detected?: string | null;
          confidence?: number | null;
          recommendations?: string | null;
          created_at?: string | null;
          file_path?: string | null;
        };
        Insert: {
          user_id?: string | null;
          crop_name?: string | null;
          image_url: string;
          disease_detected?: string | null;
          confidence?: number | null;
          recommendations?: string | null;
          created_at?: string | null;
          file_path?: string | null;
        };
      };
    };
  };
};