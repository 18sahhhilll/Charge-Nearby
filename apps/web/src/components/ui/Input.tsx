import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  id,
  className = '',
  disabled,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5 text-xs">
      {label && (
        <label htmlFor={inputId} className="block font-semibold text-[#C5D5CF]">
          {label}
        </label>
      )}

      <div className="relative rounded-xl shadow-xs">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8DA39B]">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          disabled={disabled}
          className={`w-full py-2.5 sm:py-3 bg-[#16241F] border rounded-xl text-[#E8F1EE] text-sm placeholder:text-[#8DA39B] transition duration-150 focus:outline-none focus:border-[#22E58B] disabled:opacity-50 disabled:cursor-not-allowed ${
            leftIcon ? 'pl-10' : 'pl-3.5'
          } ${rightIcon ? 'pr-10' : 'pr-3.5'} ${
            error
              ? 'border-[rgba(255,90,95,0.8)] focus:border-[#FF5A5F]'
              : 'border-[#1E2F2A] hover:border-[#1E2F2A]/80'
          } ${className}`}
          {...props}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-[11px] text-[#FF5A5F] font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-[11px] text-[#8DA39B]">{helperText}</p>
      ) : null}
    </div>
  );
};
