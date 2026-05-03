import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full border rounded-lg py-2.5 text-sm bg-white transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-[#a8c95f] focus:border-transparent',
              icon ? 'pl-9 pr-3' : 'px-3',
              error ? 'border-red-400 bg-red-50' : 'border-gray-200',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-red-500 text-xs">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
