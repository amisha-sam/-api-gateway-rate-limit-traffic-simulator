import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const setTokens = useAuthStore((s) => s.clearTokens);
  const navigate = useNavigate();

  const logout = () => {
    // Forwards to API logout ideally
    setTokens();
    setUser(null);
    navigate('/login');
  };

  if (!user) return <div className="p-6 text-gray-300">No user</div>;

  return (
    <div className="p-6">
      <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700 shadow-md max-w-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center text-xl font-mono">{user.firstName?.[0]}{user.lastName?.[0]}</div>
          <div>
            <h3 className="text-xl font-bold">{user.firstName} {user.lastName}</h3>
            <p className="text-sm text-gray-300">{user.email}</p>
            <p className="text-sm text-gray-400">{user.company} • {user.role}</p>
            <p className="text-xs text-gray-500">Member since: {user.createdAt || '—'}</p>
          </div>
        </div>

        <div className="mt-6 flex space-x-2">
          <Button onClick={() => navigate('/profile/edit')}>Edit profile</Button>
          <Button onClick={() => navigate('/profile/change-password')}>Change password</Button>
          <Button onClick={logout}>Logout</Button>
        </div>
      </div>
    </div>
  );
};
