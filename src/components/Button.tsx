import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-700 active:bg-primary-700',
  secondary:
    'bg-white text-neutral-900 border border-neutral-300 hover:bg-neutral-100',
  ghost: 'bg-transparent text-neutral-700 hover:bg-neutral-200',
  danger: 'bg-danger text-white hover:brightness-95',
};

const SIZES: Record<Size, string> = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-6 text-base',
};

export function buttonClasses(
  variant: Variant = 'primary',
  size: Size = 'md',
  fullWidth = false,
  className = '',
): string {
  return [
    'inline-flex items-center justify-center gap-2 rounded-xl font-semibold',
    'transition-colors focus-visible:outline-none focus-visible:ring-2',
    'focus-visible:ring-primary focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button className={buttonClasses(variant, size, fullWidth, className)} {...rest}>
      {children}
    </button>
  );
}
