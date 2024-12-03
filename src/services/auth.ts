import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const { data } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();
    
    return !!data;
  } catch (error) {
    return false;
  }
};

export const handleAuthError = (error: any): string => {
  console.error('Auth error:', error);

  if (error.message?.includes('Invalid login credentials')) {
    return 'Invalid email or password';
  }
  if (error.message?.includes('User already registered')) {
    return 'An account with this email already exists';
  }
  if (error.message?.includes('Password should be at least 6 characters')) {
    return 'Password must be at least 6 characters long';
  }
  if (error.message?.includes('Email not confirmed')) {
    return 'Please verify your email address';
  }
  
  return error.message || 'Authentication failed';
};