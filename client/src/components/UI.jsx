import { forwardRef } from "react";
import clsx from "clsx";

export const Input = forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={clsx(
      "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors duration-200",
      "outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
      "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
      "placeholder:text-gray-400",
      className
    )}
    {...props}
  />
));

export function Label({ children, htmlFor, className }) {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        "block text-sm font-medium text-gray-700 mb-1",
        className
      )}
    >
      {children}
    </label>
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const styles = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-sm",
    secondary:
      "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    success:
      "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm",
  };

  return (
    <button
      className={clsx(base, sizes[size], styles[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ children, className, padding = "md" }) {
  const paddingStyles = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      className={clsx(
        "rounded-xl border border-gray-200 bg-white shadow-sm",
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

export function Select({ className, ...props }) {
  return (
    <select
      className={clsx(
        "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm",
        "transition-colors duration-200 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
        "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  );
}

export function Badge({ children, variant = "default", className }) {
  const styles = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function LoadingSpinner({ size = "md", className }) {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div
      className={clsx(
        "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
        sizes[size],
        className
      )}
    />
  );
}

export function Alert({ children, variant = "info", className }) {
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    danger: "bg-red-50 border-red-200 text-red-800",
  };

  return (
    <div className={clsx("rounded-lg border p-4", styles[variant], className)}>
      {children}
    </div>
  );
}
