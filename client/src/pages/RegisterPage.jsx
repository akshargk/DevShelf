import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Loader2, Code2 } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      await register(name.trim(), email.trim(), password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-warm-surfaceRaised dark:bg-darkWarm-surfaceRaised border border-warm-border dark:border-darkWarm-border text-warm-accent dark:text-darkWarm-accent mb-3 shadow-2xs">
            <Code2 className="h-5 w-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-warm-text dark:text-darkWarm-text tracking-tight font-mono">
            Create DevShelf Account
          </h1>
          <p className="text-xs text-warm-muted dark:text-darkWarm-muted mt-1 font-sans">
            Start saving and organizing your code snippets today
          </p>
        </div>

        {/* Card */}
        <div className="bg-warm-surface dark:bg-darkWarm-surface border border-warm-border dark:border-darkWarm-border rounded-lg p-6 sm:p-7 shadow-2xs">
          {error && (
            <div className="mb-4 p-3 rounded-md bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-xs font-mono text-rose-700 dark:text-rose-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-warm-text dark:text-darkWarm-text mb-1.5 font-mono">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Developer"
                className="w-full bg-warm-bg dark:bg-darkWarm-bg border border-warm-border dark:border-darkWarm-border rounded-md px-3.5 py-2 text-xs sm:text-sm text-warm-text dark:text-darkWarm-text placeholder-warm-dim dark:placeholder-darkWarm-dim focus:outline-none focus:border-warm-accent dark:focus:border-darkWarm-accent transition-colors font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-warm-text dark:text-darkWarm-text mb-1.5 font-mono">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className="w-full bg-warm-bg dark:bg-darkWarm-bg border border-warm-border dark:border-darkWarm-border rounded-md px-3.5 py-2 text-xs sm:text-sm text-warm-text dark:text-darkWarm-text placeholder-warm-dim dark:placeholder-darkWarm-dim focus:outline-none focus:border-warm-accent dark:focus:border-darkWarm-accent transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-warm-text dark:text-darkWarm-text mb-1.5 font-mono">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-warm-bg dark:bg-darkWarm-bg border border-warm-border dark:border-darkWarm-border rounded-md px-3.5 py-2 text-xs sm:text-sm text-warm-text dark:text-darkWarm-text placeholder-warm-dim dark:placeholder-darkWarm-dim focus:outline-none focus:border-warm-accent dark:focus:border-darkWarm-accent transition-colors font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center space-x-1.5 bg-warm-accent hover:bg-warm-accentHover text-white dark:bg-darkWarm-accent dark:hover:bg-darkWarm-accentHover dark:text-[#18191D] font-semibold py-2.5 rounded-md text-xs font-mono transition-all shadow-xs active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Register</span>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-warm-border/60 dark:border-darkWarm-border/60 text-center text-xs text-warm-muted dark:text-darkWarm-muted font-sans">
            Already have an account?{' '}
            <Link to="/login" className="text-warm-accent dark:text-darkWarm-accent hover:underline font-mono font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
