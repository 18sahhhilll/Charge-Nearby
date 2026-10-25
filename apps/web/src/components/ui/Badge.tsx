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
    bg: 'bg-[rgba(52,211,153,0.12)]',
    text: 'text-[#34D399]',
    border: 'border-[rgba(52,211,153,0.3)]',
    dot: 'bg-[#34D399]',
  },
  amber: {
    bg: 'bg-[rgba(252,211,77,0.12)]',
    text: 'text-[#FCD34D]',
    border: 'border-[rgba(252,211,77,0.3)]',
    dot: 'bg-[#FCD34D]',
  },
  rose: {
    bg: 'bg-[rgba(255,90,95,0.12)]',
    text: 'text-[#FF5A5F]',
    border: 'border-[rgba(255,90,95,0.3)]',
    dot: 'bg-[#FF5A5F]',
  },
  blue: {
    bg: 'bg-[rgba(56,189,248,0.12)]',
    text: 'text-[#38BDF8]',
    border: 'border-[rgba(56,189,248,0.3)]',
    dot: 'bg-[#38BDF8]',
  },
  slate: {
    bg: 'bg-[rgba(141,163,155,0.12)]',
    text: 'text-[#8DA39B]',
    border: 'border-[#1E2F2A]',
    dot: 'bg-[#8DA39B]',
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
