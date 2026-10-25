import React from 'react';
import { RotateCw } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  disabled,
  className = '',
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'text-xs px-3 py-1.5 space-x-1.5',
    md: 'text-xs sm:text-sm px-4 py-2.5 space-x-2',
    lg: 'text-sm sm:text-base px-6 py-3.5 space-x-2.5 rounded-2xl',
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-[#22E58B] hover:bg-[#1BC878] text-[#04130C] shadow-md shadow-[#22E58B]/20 border border-[#22E58B]/30',
    secondary:
      'bg-transparent hover:bg-[rgba(34,229,139,0.12)] text-[#22E58B] border border-[rgba(34,229,139,0.4)] shadow-xs',
    outline:
      'bg-transparent hover:bg-[#16241F] text-[#8DA39B] hover:text-[#E8F1EE] border border-[#1E2F2A] hover:border-[rgba(34,229,139,0.3)]',
    ghost:
      'bg-transparent hover:bg-[rgba(34,229,139,0.12)] text-[#8DA39B] hover:text-[#22E58B]',
    danger:
      'bg-[rgba(255,90,95,0.12)] hover:bg-[rgba(255,90,95,0.2)] text-[#FF5A5F] border border-[rgba(255,90,95,0.3)]',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <RotateCw className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  );
};
