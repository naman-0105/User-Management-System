import { cn } from "../../utils/cn";

const variants = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500 dark:bg-brand-500 dark:hover:bg-brand-600",
  secondary:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-500 dark:bg-rose-500 dark:hover:bg-rose-600",
  ghost:
    "text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400 dark:text-gray-300 dark:hover:bg-gray-800",
};

export default function Button({ className, variant = "primary", children, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-gray-900",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
