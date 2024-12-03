import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Leaf } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { checkEmailExists } from '../../services/auth';
import toast from 'react-hot-toast';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        await signIn(formData.email, formData.password);
        navigate('/dashboard');
      } else {
        if (!formData.name) {
          toast.error('Please enter your name');
          return;
        }

        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters long');
          return;
        }

        const emailExists = await checkEmailExists(formData.email);
        if (emailExists) {
          toast.error('An account with this email already exists');
          return;
        }

        await signUp(formData.email, formData.password, formData.name);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mint flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center items-center space-x-2 mb-8">
        <Sprout className="h-8 w-8 text-green-500" />
        <Leaf className="h-8 w-8 text-green-600" />
      </div>

      <h1 className="text-3xl font-bold text-center mb-2">
        Smart Farmer Dashboard
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Empowering farmers with intelligent crop management
      </p>

      <div className="auth-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                className="auth-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              required
              className="auth-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              className="auth-input"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`auth-button ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>{mode === 'login' ? 'New to Smart Farmer?' : 'Already have an account?'}</span>
        </div>

        <button
          onClick={() => navigate(mode === 'login' ? '/signup' : '/login')}
          className="auth-alt-button"
          disabled={loading}
        >
          {mode === 'login' ? 'Create Account' : 'Sign In'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;