import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  id,
  className = '',
  required = false,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-brand-text mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20 ${
          error ? 'border-rose-300 focus:border-rose-500' : 'border-brand-border focus:border-brand'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-brand-muted mt-1">{helperText}</p>}
    </div>
  );
};

export const TextArea = ({
  label,
  error,
  helperText,
  id,
  rows = 4,
  className = '',
  required = false,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-brand-text mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20 ${
          error ? 'border-rose-300 focus:border-rose-500' : 'border-brand-border focus:border-brand'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-brand-muted mt-1">{helperText}</p>}
    </div>
  );
};

export default Input;
