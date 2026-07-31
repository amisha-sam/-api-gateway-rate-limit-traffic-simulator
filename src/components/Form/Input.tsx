import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string | null;
};

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...rest }) => {
  return (
    <label className="block">
      {label && <div className="text-sm font-medium mb-1">{label}</div>}
      <input
        {...rest}
        className={`w-full rounded-md bg-gray-800 border border-gray-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
      />
      {error && <p role="alert" className="mt-1 text-xs text-red-400">{error}</p>}
    </label>
  );
};
