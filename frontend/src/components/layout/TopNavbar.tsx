import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Settings, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TopNavbarProps {
  onOpenMobileSidebar: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenMobileSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30 px-4 flex items-center justify-between gap-4">
      {/* Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full flex items-center">
          <Search className="absolute left-3 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search endpoints, configs, telemetry..."
            className="w-full pl-8 pr-10 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 absolute right-2.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-zinc-400 bg-zinc-800 border border-zinc-700 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 pr-2.5 rounded-lg border border-zinc-800 bg-zinc-900 hover:border-zinc-700 transition-colors"
          >
            <div className="w-6 h-6 rounded-md bg-zinc-800 text-zinc-100 font-bold text-xs flex items-center justify-center">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="hidden sm:inline text-xs font-medium text-zinc-200">
              {user?.fullName || 'Account'}
            </span>
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-zinc-800 bg-zinc-900 shadow-xl p-1.5 z-50">
              <div className="px-3 py-2 border-b border-zinc-800 mb-1">
                <p className="text-xs font-semibold text-zinc-100">{user?.fullName || 'User'}</p>
                <p className="text-[11px] text-zinc-400 truncate">{user?.email || 'user@example.com'}</p>
              </div>

              <button
                onClick={() => {
                  navigate('/profile');
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-zinc-200 hover:bg-zinc-800 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-zinc-400" />
                Profile Settings
              </button>

              <button
                onClick={() => {
                  navigate('/settings');
                  setProfileDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-zinc-200 hover:bg-zinc-800 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-zinc-400" />
                Preferences
              </button>

              <div className="my-1 border-t border-zinc-800" />

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
