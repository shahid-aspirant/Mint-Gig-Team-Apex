import React from 'react';

const variants = {
  primary: 'bg-brand hover:bg-brand-dark text-white shadow-sm focus:ring-brand-light',
  secondary: 'bg-brand-accentLight text-brand-dark hover:bg-brand-accent focus:ring-brand',
  outline: 'border border-brand-border bg-white text-brand-text hover:bg-gray-50 focus:ring-brand',
  ghost: 'text-brand-text hover:bg-gray-100 focus:ring-gray-300',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-400',
  mint: 'bg-brand-accent text-brand-dark hover:bg-emerald-200 font-semibold',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-lg',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
