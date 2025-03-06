import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        set({ user: data.user });
      } else {
        throw new Error('Login gagal: Email atau password salah');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  signOut: async () => {
    try {
      // Set user to null first to prevent the 403 error
      set({ user: null });
      // Then sign out from Supabase
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, we want to make sure the user is logged out locally
      set({ user: null });
    }
  },
  setUser: (user) => set({ user, loading: false }),
}));