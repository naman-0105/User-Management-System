export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200 dark:bg-gray-700 ${className}`}
    />
  );
}
