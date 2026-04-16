import { cn } from "../../utils/cn";

export default function Card({ className, children }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-gray-800 dark:bg-gray-900",
        className
      )}
    >
      {children}
    </div>
  );
}
