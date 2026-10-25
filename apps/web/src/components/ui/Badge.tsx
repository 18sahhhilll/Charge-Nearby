import React from 'react';

export type BadgeVariant = 'emerald' | 'amber' | 'rose' | 'blue' | 'slate';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  pulse?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; border: string; dot: string }> = {
  emerald: {
    bg: 'bg-emerald-50 [.surface-dark_&]:bg-[rgba(52,211,153,0.12)]',
    text: 'text-emerald-700 [.surface-dark_&]:text-[#34D399]',
    border: 'border-emerald-200 [.surface-dark_&]:border-[rgba(52,211,153,0.3)]',
    dot: 'bg-emerald-600 [.surface-dark_&]:bg-[#34D399]',
  },
  amber: {
    bg: 'bg-amber-50 [.surface-dark_&]:bg-[rgba(252,211,77,0.12)]',
    text: 'text-amber-800 [.surface-dark_&]:text-[#FCD34D]',
    border: 'border-amber-200 [.surface-dark_&]:border-[rgba(252,211,77,0.3)]',
    dot: 'bg-amber-600 [.surface-dark_&]:bg-[#FCD34D]',
  },
  rose: {
    bg: 'bg-rose-50 [.surface-dark_&]:bg-[rgba(255,90,95,0.12)]',
    text: 'text-rose-700 [.surface-dark_&]:text-[#FF5A5F]',
    border: 'border-rose-200 [.surface-dark_&]:border-[rgba(255,90,95,0.3)]',
    dot: 'bg-rose-600 [.surface-dark_&]:bg-[#FF5A5F]',
  },
  blue: {
    bg: 'bg-blue-50 [.surface-dark_&]:bg-[rgba(56,189,248,0.12)]',
    text: 'text-blue-700 [.surface-dark_&]:text-[#38BDF8]',
    border: 'border-blue-200 [.surface-dark_&]:border-[rgba(56,189,248,0.3)]',
    dot: 'bg-blue-600 [.surface-dark_&]:bg-[#38BDF8]',
  },
  slate: {
    bg: 'bg-slate-100 [.surface-dark_&]:bg-[rgba(141,163,155,0.12)]',
    text: 'text-slate-700 [.surface-dark_&]:text-[#8DA39B]',
    border: 'border-slate-200 [.surface-dark_&]:border-[#1E2F2A]',
    dot: 'bg-slate-500 [.surface-dark_&]:bg-[#8DA39B]',
  },
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'slate',
  size = 'md',
  dot = false,
  pulse = false,
  className = '',
  children,
  ...props
}) => {
  const styles = variantStyles[variant];
  const sizeClasses = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center space-x-1.5 font-semibold rounded-full border ${styles.bg} ${styles.text} ${styles.border} ${sizeClasses} ${className}`}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${styles.dot}`}
            />
          )}
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${styles.dot}`} />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};
