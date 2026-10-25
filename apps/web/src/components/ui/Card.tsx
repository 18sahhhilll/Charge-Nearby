import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'subtle' | 'elevated' | 'dark';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  className = '',
  children,
  ...props
}) => {
  const variantStyles = {
    default:
      'bg-[var(--ws-surface)] border border-[var(--ws-border)] text-[var(--ws-text)] shadow-sm',
    glass:
      'bg-[var(--ws-surface)]/90 border border-[var(--ws-border)] backdrop-blur-xl text-[var(--ws-text)] shadow-sm',
    subtle:
      'bg-[var(--ws-surface-2)] border border-[var(--ws-border)] text-[var(--ws-text-body)]',
    elevated:
      'bg-[var(--ws-surface)] border border-[var(--ws-border)] shadow-xl text-[var(--ws-text)]',
    dark:
      'bg-[var(--ws-surface)] border border-[var(--ws-border)] text-[var(--ws-text)] shadow-xl',
  };

  return (
    <div
      className={`rounded-2xl lg:rounded-3xl p-5 sm:p-6 transition-all duration-200 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`flex flex-col space-y-1.5 pb-4 border-b border-[var(--ws-border)] ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <h3 className={`text-lg sm:text-xl font-bold tracking-tight text-[var(--ws-text)] ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <p className={`text-xs sm:text-sm text-[var(--ws-text-muted)] ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`pt-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`flex items-center pt-4 border-t border-[var(--ws-border)] ${className}`} {...props}>
    {children}
  </div>
);
