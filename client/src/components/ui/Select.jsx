import { cn } from "../../utils/cn";

export default function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        `
        w-full rounded-lg border border-slate-300 bg-white 
        px-3 py-2.5 text-sm text-slate-900 outline-none transition

        focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20

        dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100

        text-base sm:text-sm
        py-3 sm:py-2.5
        min-h-[44px]  /* better touch target */
        `,
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}