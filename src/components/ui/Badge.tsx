import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variantStyles = {
    default: 'bg-gray-100 text-gray-700 border border-gray-200',
    success: 'bg-green-50 text-green-700 border border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    error: 'bg-red-50 text-red-700 border border-red-200',
    info: 'text-[#5222DB] border',
  };

  const variantBgStyles = {
    info: { backgroundColor: '#4727a120', borderColor: '#5222DB40' }, // 20% opacity
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${variantStyles[variant]} ${className}`}
      style={variant === 'info' ? variantBgStyles.info : undefined}
    >
      {children}
    </span>
  );
}

