import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Plus, LogOut, Sun, Moon, Code2 } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userInitial = (user?.name || user?.email || 'U').charAt(0).toUpperCase();

  return (
    <header className="w-full bg-warm-surface dark:bg-darkWarm-surface border-b border-warm-border dark:border-darkWarm-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand: Logo + DevShelf v1.0 + Subtitle */}
        <Link to="/dashboard" className="flex items-center gap-3 group shrink-0">
          <div className="h-10 w-10 rounded-md bg-warm-surfaceRaised dark:bg-darkWarm-surfaceRaised border border-warm-border dark:border-darkWarm-border flex items-center justify-center text-warm-accent dark:text-darkWarm-accent transition-colors">
            <Code2 className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-warm-text dark:text-darkWarm-text font-mono leading-none">
                DevShelf
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-warm-surfaceRaised dark:bg-darkWarm-surfaceRaised text-warm-muted dark:text-darkWarm-muted border border-warm-border dark:border-darkWarm-border">
                v1.0
              </span>
            </div>
            <span className="text-xs text-warm-muted dark:text-darkWarm-muted font-sans mt-1">
              Developer Snippet Manager
            </span>
          </div>
        </Link>

        {/* Right Action Area */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            type="button"
            className="h-9 px-3 flex items-center gap-1.5 rounded-md border border-warm-border dark:border-darkWarm-border bg-warm-surfaceRaised/50 hover:bg-warm-surfaceRaised dark:bg-darkWarm-surfaceRaised/50 dark:hover:bg-darkWarm-surfaceRaised text-warm-muted hover:text-warm-text dark:text-darkWarm-muted dark:hover:text-darkWarm-text text-xs font-mono transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-4 w-4 text-darkWarm-accent" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-warm-accent" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {isAuthenticated ? (
            <>
              {/* Primary CTA: + New Snippet */}
              <Link
                to="/snippets/new"
                className="h-9 px-3.5 sm:px-4 inline-flex items-center gap-1.5 rounded-md font-semibold text-xs tracking-wide transition-all shadow-xs active:scale-[0.98] bg-warm-accent hover:bg-warm-accentHover text-white dark:bg-darkWarm-accent dark:hover:bg-darkWarm-accentHover dark:text-[#18191D] cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>New Snippet</span>
              </Link>

              <div className="h-5 w-px bg-warm-border dark:bg-darkWarm-border hidden sm:block" />

              {/* User Profile Badge & Logout */}
              <div className="flex items-center gap-2">
                <div
                  className="h-8 w-8 rounded-full bg-warm-surfaceRaised dark:bg-darkWarm-surfaceRaised border border-warm-border dark:border-darkWarm-border flex items-center justify-center text-xs font-mono font-semibold text-warm-text dark:text-darkWarm-text"
                  title={user?.email || 'Logged in user'}
                >
                  {userInitial}
                </div>
                <span className="text-xs text-warm-muted dark:text-darkWarm-muted hidden md:inline truncate max-w-[130px] font-mono">
                  {user?.name || user?.email}
                </span>

                <button
                  onClick={handleLogout}
                  title="Sign out of DevShelf"
                  className="p-1.5 text-warm-muted hover:text-rose-600 dark:text-darkWarm-muted dark:hover:text-rose-400 rounded-md hover:bg-warm-surfaceRaised dark:hover:bg-darkWarm-surfaceRaised transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-xs font-medium">
              <Link
                to="/login"
                className="h-9 px-3 inline-flex items-center text-warm-muted hover:text-warm-text dark:text-darkWarm-muted dark:hover:text-darkWarm-text rounded-md hover:bg-warm-surfaceRaised dark:hover:bg-darkWarm-surfaceRaised transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="h-9 px-4 inline-flex items-center rounded-md font-semibold bg-warm-accent hover:bg-warm-accentHover text-white dark:bg-darkWarm-accent dark:hover:bg-darkWarm-accentHover dark:text-[#18191D] transition-all shadow-xs"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
