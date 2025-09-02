import { forwardRef } from "react";
import clsx from "clsx";

export const Input = forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={clsx(
      "w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900",
      className
    )}
    {...props}
  />
));

export function Label({ children, htmlFor }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm mb-1 font-medium">
      {children}
    </label>
  );
}

export function Button({ children, variant = "primary", className, ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed";
  const styles = {
    primary: "bg-gray-900 text-white hover:bg-black",
    secondary: "bg-gray-100 hover:bg-gray-200",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "hover:bg-gray-100",
  };
  return (
    <button className={clsx(base, styles[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function Card({ children, className }) {
  return (
    <div
      className={clsx("rounded-2xl border bg-white p-4 shadow-sm", className)}
    >
      {children}
    </div>
  );
}

export function Select({ className, ...props }) {
  return (
    <select
      className={clsx(
        "w-full rounded-xl border border-gray-300 px-3 py-2 text-sm",
        className
      )}
      {...props}
    />
  );
}
