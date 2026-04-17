import Button from "../ui/Button";

export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      <p className="text-sm text-slate-500 dark:text-gray-400">
        Page {page} of {Math.max(totalPages, 1)}
      </p>
      <div className="flex gap-2">
        <Button type="button" variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        <Button type="button" variant="secondary" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
