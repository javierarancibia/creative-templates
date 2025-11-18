import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white ${
          error ? 'border-red-500 bg-red-50' : ''
        } ${className}`}
        style={{ '--tw-ring-color': '#5222DB' } as React.CSSProperties}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
}

