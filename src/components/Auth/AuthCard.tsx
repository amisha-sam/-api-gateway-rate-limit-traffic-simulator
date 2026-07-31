import React from 'react';

export const AuthCard: React.FC<{ title?: string; subtitle?: string; children?: React.ReactNode }> = ({ title, subtitle, children }) => {
  return (
    <div className="max-w-md w-full bg-gradient-to-br from-gray-900/60 to-gray-800/60 border border-gray-700 rounded-xl p-8 shadow-lg backdrop-blur">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        {subtitle && <p className="text-sm text-gray-300 mt-1">{subtitle}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
};
