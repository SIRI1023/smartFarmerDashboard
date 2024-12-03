import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { handleAuthError } from '../services/auth';

interface AuthState {
  user: any;
  session: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  syncUserToDatabase: (user: any, name?: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,

  syncUserToDatabase: async (user, name?) => {
    if (!user) return;

    try {
      // Check if user exists in public.users
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking user:', fetchError);
        return;
      }

      if (!existingUser) {
        // Insert new user
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            name: name || user.user_metadata?.name || '',
            created_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Error creating user record:', insertError);
          throw new Error('Failed to create user profile');
        }
      }
    } catch (error) {
      console.error('Error in user sync:', error);
      throw error;
    }
  },

  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;

      const store = useAuthStore.getState();
      await store.syncUserToDatabase(data.user);
      
      set({ user: data.user, session: data.session });
      toast.success('Successfully signed in');
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      toast.error(errorMessage);
      throw error;
    }
  },

  signUp: async (email, password, name) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: window.location.origin,
        },
      });
      
      if (error) throw error;

      if (data.user) {
        const store = useAuthStore.getState();
        await store.syncUserToDatabase(data.user, name);
        
        set({ user: data.user, session: data.session });
        toast.success('Account created! Please check your email to verify your account.');
      }
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      toast.error(errorMessage);
      throw error;
    }
  },

  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, session: null });
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
      throw error;
    }
  },

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const store = useAuthStore.getState();
        await store.syncUserToDatabase(session.user);
      }
      
      set({ session, user: session?.user ?? null, loading: false });
      
      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const store = useAuthStore.getState();
          await store.syncUserToDatabase(session.user);
        }
        set({ session, user: session?.user ?? null });
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ loading: false });
    }
  },
}));