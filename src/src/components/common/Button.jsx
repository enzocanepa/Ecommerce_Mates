import { forwardRef } from 'react';
import { clsx } from 'clsx';
const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';
const variants = {
    primary: 'bg-[#a8c95f] hover:bg-[#8fb84d] text-[#4a5f2f] focus-visible:ring-[#a8c95f]',
    secondary: 'bg-[#c7e47d] hover:bg-[#b8d66e] text-[#4a5f2f] focus-visible:ring-[#c7e47d]',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus-visible:ring-gray-400',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus-visible:ring-red-500',
};
const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
};
export const Button = forwardRef(({ variant = 'primary', size = 'md', loading = false, className, children, disabled, ...props }, ref) => (<button ref={ref} disabled={disabled || loading} className={clsx(base, variants[variant], sizes[size], className)} {...props}>
      {loading && (<span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>)}
      {children}
    </button>));
Button.displayName = 'Button';
