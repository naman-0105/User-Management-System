import { cn } from "../../utils/cn";

const variants = {
  neutral: "bg-slate-100 text-slate-700 dark:bg-gray-800 dark:text-gray-200",
  success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  danger: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  info: "bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300",
};

export default function Badge({ children, variant = "neutral", className }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  );
}
