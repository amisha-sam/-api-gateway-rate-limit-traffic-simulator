import React, { useState } from 'react';
import { Input } from './Input';

export const PasswordInput: React.FC<{
  label?: string;
  error?: string | null;
} & React.InputHTMLAttributes<HTMLInputElement>> = ({ label, error, ...rest }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <div className="relative">
        <Input
          type={visible ? 'text' : 'password'}
          label={label}
          error={error}
          {...rest}
        />
        <button
          type="button"
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-2 top-8 text-sm text-gray-300"
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
  );
};
